import time

from app.agent.base import BaseTool, ToolDefinition
from app.retrieval import SemanticSearch, RetrievalResult
from app.schemas.agent import ToolType
from app.core.logging import get_logger

logger = get_logger("agent.tools.doc_search")


DOC_TYPE_KEYWORDS = {
    "readme": ["readme", "getting started", "introduction", "overview"],
    "architecture": ["architecture", "design", "system design", "component diagram", "structure"],
    "wiki": ["wiki", "knowledge base", "documentation", "docs"],
    "api_doc": ["api documentation", "endpoint", "api reference", "openapi", "swagger"],
    "setup": ["setup", "installation", "install", "prerequisites", "getting started"],
    "guide": ["guide", "tutorial", "how to", "walkthrough", "example"],
}


class DocumentationSearchTool(BaseTool):
    @property
    def definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=ToolType.DOCUMENTATION_SEARCH,
            description=(
                "Search documentation including READMEs, markdown files, wikis, PDFs, "
                "and architecture documents. Returns relevant document sections with content."
            ),
            parameters_schema={
                "query": {
                    "type": "string",
                    "description": "What to search for in documentation",
                },
                "top_k": {
                    "type": "integer",
                    "description": "Maximum results to return (default 10)",
                    "default": 10,
                },
                "doc_type": {
                    "type": "string",
                    "description": "Filter by doc type: readme, architecture, wiki, api_doc, setup, guide",
                },
                "repository": {
                    "type": "string",
                    "description": "Optional repository name to scope search",
                },
            },
            examples=[
                "Read the README",
                "What is the system architecture?",
                "Show me the setup guide",
                "Find API documentation",
            ],
            keywords=[
                "documentation", "docs", "readme", "wiki", "architecture",
                "guide", "manual", "reference", "pdf", "markdown", "md",
                "setup instructions", "getting started", "introduction",
            ],
        )

    def matches_query(self, query: str) -> float:
        score = super().matches_query(query)
        query_lower = query.lower()
        for doc_type, keywords in DOC_TYPE_KEYWORDS.items():
            for kw in keywords:
                if kw in query_lower:
                    score += 0.2
                    break
        return min(score, 1.0)

    async def execute(self, parameters: dict) -> dict:
        start = time.perf_counter()
        query = parameters.get("query", "")
        top_k = parameters.get("top_k", 10)
        doc_type = parameters.get("doc_type")
        repository = parameters.get("repository")

        search = SemanticSearch()
        filter_metadata = {}
        if repository:
            filter_metadata["repository"] = repository
        if doc_type:
            filter_metadata["document_type"] = doc_type

        results: list[RetrievalResult] = await search.search(
            query=query,
            top_k=top_k,
            filter_metadata=filter_metadata if filter_metadata else None,
        )

        formatted_results = []
        for r in results:
            meta = r.metadata
            formatted_results.append({
                "document_type": meta.get("document_type", ""),
                "file": meta.get("filename", ""),
                "path": meta.get("file_path", ""),
                "repository": meta.get("repository", ""),
                "score": round(r.score, 4),
                "content": r.content,
                "language": meta.get("language", ""),
                "chunk_index": meta.get("chunk_index", 0),
            })

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "Documentation search: query='%s' results=%d time=%.1fms",
            query[:50], len(formatted_results), elapsed_ms,
        )

        return {
            "query": query,
            "results": formatted_results,
            "total_results": len(formatted_results),
            "execution_time_ms": round(elapsed_ms, 1),
        }
