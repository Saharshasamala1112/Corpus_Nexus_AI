import time

from app.agent.base import BaseTool, ToolDefinition
from app.retrieval import SemanticSearch, RetrievalResult
from app.schemas.agent import ToolType
from app.core.logging import get_logger

logger = get_logger("agent.tools.repo_search")


class RepositorySearchTool(BaseTool):
    @property
    def definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=ToolType.REPOSITORY_SEARCH,
            description=(
                "Search indexed repositories for code, functions, classes, and implementations. "
                "Returns repository name, file path, function/class names, and relevance scores."
            ),
            parameters_schema={
                "query": {
                    "type": "string",
                    "description": "Search query describing what to find in the codebase",
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
                "language": {
                    "type": "string",
                    "description": "Optional language filter (python, typescript, etc.)",
                },
            },
            examples=[
                "Find the authentication middleware",
                "Search for database models",
                "Where is the API rate limiter implemented?",
                "Find all API endpoint definitions",
            ],
            keywords=[
                "find", "search", "code", "function", "class", "implementation",
                "repository", "repo", "where", "file", "module", "component",
                "middleware", "service", "controller", "handler", "router",
                "model", "schema", "type", "interface",
            ],
        )

    def matches_query(self, query: str) -> float:
        score = super().matches_query(query)
        high_value = ["find", "search", "where is", "code", "function", "class",
                       "implementation", "repository", "repo", "file", "module"]
        query_lower = query.lower()
        for term in high_value:
            if term in query_lower:
                score += 0.2
        return min(score, 1.0)

    async def execute(self, parameters: dict) -> dict:
        start = time.perf_counter()
        query = parameters.get("query", "")
        top_k = parameters.get("top_k", 10)
        repository = parameters.get("repository")
        language = parameters.get("language")

        search = SemanticSearch()
        filter_metadata = {}
        if repository:
            filter_metadata["repository"] = repository
        if language:
            filter_metadata["language"] = language

        results: list[RetrievalResult] = await search.search(
            query=query,
            top_k=top_k,
            filter_metadata=filter_metadata if filter_metadata else None,
        )

        formatted_results = []
        for r in results:
            meta = r.metadata
            formatted_results.append({
                "repository": meta.get("repository", "unknown"),
                "file": meta.get("filename", ""),
                "path": meta.get("file_path", ""),
                "function": _extract_function_name(r.content),
                "score": round(r.score, 4),
                "document_type": meta.get("document_type", ""),
                "language": meta.get("language", ""),
                "chunk_index": meta.get("chunk_index", 0),
                "content_preview": r.content[:500],
            })

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "Repository search: query='%s' results=%d time=%.1fms",
            query[:50], len(formatted_results), elapsed_ms,
        )

        return {
            "query": query,
            "results": formatted_results,
            "total_results": len(formatted_results),
            "execution_time_ms": round(elapsed_ms, 1),
        }


def _extract_function_name(content: str) -> str:
    for line in content.split("\n")[:5]:
        stripped = line.strip()
        for prefix in ("def ", "function ", "async def ", "class ", "export function "):
            if stripped.startswith(prefix):
                name = stripped[len(prefix):].split("(")[0].split(":")[0].strip()
                return name
    return ""
