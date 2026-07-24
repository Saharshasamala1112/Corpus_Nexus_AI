import re
import time

from app.agent.base import BaseTool, ToolDefinition
from app.core.logging import get_logger
from app.retrieval import RetrievalResult, SemanticSearch
from app.schemas.agent import ToolType

logger = get_logger("agent.tools.db_explorer")


class DatabaseExplorerTool(BaseTool):
    @property
    def definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=ToolType.DATABASE_EXPLORER,
            description=(
                "Explore PostgreSQL database schemas, tables, columns, relationships, "
                "and indexes. Analyzes SQLAlchemy models and migration files."
            ),
            parameters_schema={
                "query": {
                    "type": "string",
                    "description": "What to search for in the database schema",
                },
                "top_k": {
                    "type": "integer",
                    "description": "Maximum results to return (default 10)",
                    "default": 10,
                },
                "repository": {
                    "type": "string",
                    "description": "Optional repository name to scope search",
                },
            },
            examples=[
                "Show me the database schema",
                "What tables exist?",
                "Find the user model",
                "Show database relationships",
            ],
            keywords=[
                "database",
                "db",
                "schema",
                "table",
                "column",
                "field",
                "postgresql",
                "postgres",
                "sql",
                "model",
                "migration",
                "relationship",
                "foreign key",
                "index",
                "primary key",
                "orm",
                "sqlalchemy",
                "django",
                "entity",
            ],
        )

    def matches_query(self, query: str) -> float:
        score = super().matches_query(query)
        query_lower = query.lower()
        db_terms = [
            "database",
            "schema",
            "table",
            "column",
            "model",
            "migration",
            "relationship",
            "foreign key",
            "index",
            "sql",
            "orm",
            "postgresql",
        ]
        for term in db_terms:
            if term in query_lower:
                score += 0.2
        return min(score, 1.0)

    async def execute(self, parameters: dict) -> dict:
        start = time.perf_counter()
        query = parameters.get("query", "")
        top_k = parameters.get("top_k", 10)
        repository = parameters.get("repository")

        search = SemanticSearch()
        filter_metadata = {}
        if repository:
            filter_metadata["repository"] = repository

        results: list[RetrievalResult] = await search.search(
            query=query,
            top_k=top_k,
            filter_metadata=filter_metadata if filter_metadata else None,
        )

        tables = {}
        relationships = []
        indexes = []

        for r in results:
            meta = r.metadata
            content = r.content
            file_path = meta.get("file_path", "")

            if (
                "model" in file_path.lower()
                or "migration" in file_path.lower()
                or ".py" in file_path
            ):
                extracted = _extract_model_info(content, file_path)
                for table_name, table_info in extracted["tables"].items():
                    if table_name not in tables:
                        tables[table_name] = table_info
                    else:
                        tables[table_name]["columns"].extend(table_info["columns"])
                relationships.extend(extracted["relationships"])
                indexes.extend(extracted["indexes"])

        table_list = []
        for name, info in tables.items():
            seen_cols = set()
            unique_cols = []
            for col in info["columns"]:
                if col["name"] not in seen_cols:
                    seen_cols.add(col["name"])
                    unique_cols.append(col)
            table_list.append(
                {
                    "table_name": name,
                    "columns": unique_cols,
                    "source_file": info["source_file"],
                }
            )

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "Database explorer: query='%s' tables=%d time=%.1fms",
            query[:50],
            len(table_list),
            elapsed_ms,
        )

        return {
            "query": query,
            "tables": table_list,
            "relationships": _deduplicate_relationships(relationships),
            "indexes": _deduplicate_indexes(indexes),
            "total_tables": len(table_list),
            "execution_time_ms": round(elapsed_ms, 1),
        }


def _extract_model_info(content: str, file_path: str) -> dict:
    tables: dict[str, dict] = {}
    relationships = []
    indexes = []

    class_pattern = re.compile(r"class\s+(\w+)\(.*(?:Base.*Model|db\.Model|DeclarativeBase)")
    for class_match in class_pattern.finditer(content):
        class_name = class_match.group(1)
        table_name = _derive_table_name(class_name)
        columns = _extract_columns(content, class_match.start())
        tables[table_name] = {
            "columns": columns,
            "source_file": file_path,
        }

    fk_pattern = re.compile(
        r"(\w+)\s*=\s*(?:Column|Mapped)\s*\([^)]*ForeignKey\s*\(\s*['\"](\w+)\.(\w+)['\"]",
        re.IGNORECASE,
    )
    for fk_match in fk_pattern.finditer(content):
        relationships.append(
            {
                "from_column": fk_match.group(1),
                "to_table": fk_match.group(2),
                "to_column": fk_match.group(3),
            }
        )

    idx_pattern = re.compile(
        r"Index\s*\(\s*['\"](\w+)['\"].*?on\s*=?\s*(?:\(?\s*(\w+(?:\.\w+)*)\s*\)?)",
        re.IGNORECASE,
    )
    for idx_match in idx_pattern.finditer(content):
        indexes.append(
            {
                "name": idx_match.group(1),
                "columns": idx_match.group(2),
            }
        )

    return {"tables": tables, "relationships": relationships, "indexes": indexes}


def _derive_table_name(class_name: str) -> str:
    result = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "_", class_name)
    result = re.sub(r"(?<=[A-Z])(?=[A-Z][a-z])", "_", result)
    return result.lower()


def _extract_columns(content: str, class_start: int) -> list[dict]:
    columns = []
    col_pattern = re.compile(
        r"(\w+)\s*:\s*(?:Mapped|Column)\[?(?:\w+(?:\[\w+\])?)?\]?\s*=\s*(?:Mapped|Column)\s*\((.*?)\)",
        re.DOTALL,
    )
    simple_col = re.compile(r"(\w+)\s*=\s*Column\s*\((.*?)\)")
    basic_pattern = re.compile(r"(\w+)\s*=\s*(?:mapped_column|Column)\s*\((.*?)\)")

    search_text = content[class_start : class_start + 3000]

    for pattern in [col_pattern, simple_col, basic_pattern]:
        for col_match in pattern.finditer(search_text):
            col_name = col_match.group(1)
            if col_name.startswith("_"):
                continue
            col_def = col_match.group(2)
            col_type = _extract_type(col_def)
            is_pk = "primary_key" in col_def
            nullable = "nullable=False" not in col_def
            columns.append(
                {
                    "name": col_name,
                    "type": col_type,
                    "primary_key": is_pk,
                    "nullable": nullable,
                }
            )

    return columns


def _extract_type(col_def: str) -> str:
    type_match = re.search(
        r"(String|Integer|Float|Boolean|Text|DateTime|Date|UUID|JSON|ForeignKey|LargeBinary|BigInteger|Numeric)",
        col_def,
        re.IGNORECASE,
    )
    if type_match:
        return type_match.group(1)
    bracket_match = re.search(r"\[(\w+)", col_def)
    if bracket_match:
        return bracket_match.group(1)
    return "unknown"


def _deduplicate_relationships(relationships: list[dict]) -> list[dict]:
    seen = set()
    unique = []
    for rel in relationships:
        key = (rel["from_column"], rel["to_table"], rel["to_column"])
        if key not in seen:
            seen.add(key)
            unique.append(rel)
    return unique


def _deduplicate_indexes(indexes: list[dict]) -> list[dict]:
    seen = set()
    unique = []
    for idx in indexes:
        if idx["name"] not in seen:
            seen.add(idx["name"])
            unique.append(idx)
    return unique
