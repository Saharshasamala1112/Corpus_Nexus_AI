import re
import time

from app.agent.base import BaseTool, ToolDefinition
from app.core.logging import get_logger
from app.retrieval import RetrievalResult, SemanticSearch
from app.schemas.agent import ToolType

logger = get_logger("agent.tools.api_explorer")

HTTP_METHODS = {"get", "post", "put", "patch", "delete", "head", "options"}
ENDPOINT_PATTERN = re.compile(
    r"""@(?:app|router)\.(get|post|put|patch|delete|head|options)\(\s*['"]([^'"]+)['"]""",
    re.IGNORECASE,
)
DESC_PATTERN = re.compile(r"""summary\s*=\s*['"]([^'"]+)['"]""")


class APIExplorerTool(BaseTool):
    @property
    def definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=ToolType.API_EXPLORER,
            description=(
                "Search and explore REST API endpoints. Finds route definitions, "
                "HTTP methods, request/response schemas, and descriptions from code."
            ),
            parameters_schema={
                "query": {
                    "type": "string",
                    "description": "Search for API endpoints or functionality",
                },
                "top_k": {
                    "type": "integer",
                    "description": "Maximum results to return (default 10)",
                    "default": 10,
                },
                "method": {
                    "type": "string",
                    "description": "Filter by HTTP method: GET, POST, PUT, PATCH, DELETE",
                },
                "repository": {
                    "type": "string",
                    "description": "Optional repository name to scope search",
                },
            },
            examples=[
                "Find all POST endpoints",
                "Show me the chat API",
                "What endpoints handle authentication?",
                "List all API routes",
            ],
            keywords=[
                "api",
                "endpoint",
                "route",
                "rest",
                "http",
                "request",
                "response",
                "get",
                "post",
                "put",
                "delete",
                "patch",
                "handler",
                "controller",
                "fastapi",
                "router",
                "url",
                "path",
                "swagger",
                "openapi",
            ],
        )

    def matches_query(self, query: str) -> float:
        score = super().matches_query(query)
        query_lower = query.lower()
        for method in HTTP_METHODS:
            if method in query_lower:
                score += 0.25
        if any(term in query_lower for term in ["api", "endpoint", "route", "rest"]):
            score += 0.2
        return min(score, 1.0)

    async def execute(self, parameters: dict) -> dict:
        start = time.perf_counter()
        query = parameters.get("query", "")
        top_k = parameters.get("top_k", 10)
        method_filter = parameters.get("method", "").upper()
        repository = parameters.get("repository")

        search = SemanticSearch()
        filter_metadata = {}
        if repository:
            filter_metadata["repository"] = repository

        results: list[RetrievalResult] = await search.search(
            query=query,
            top_k=top_k * 2,
            filter_metadata=filter_metadata if filter_metadata else None,
        )

        endpoints = []
        for r in results:
            meta = r.metadata
            content = r.content
            file_path = meta.get("file_path", "")
            if not any(ext in file_path for ext in [".py", ".ts", ".js", ".go"]):
                continue

            found_endpoints = _extract_endpoints(content, file_path)
            for ep in found_endpoints:
                if method_filter and ep["method"] != method_filter:
                    continue
                ep["repository"] = meta.get("repository", "")
                ep["score"] = round(r.score, 4)
                endpoints.append(ep)

        seen = set()
        unique_endpoints = []
        for ep in endpoints:
            key = (ep["method"], ep["endpoint"])
            if key not in seen:
                seen.add(key)
                unique_endpoints.append(ep)

        unique_endpoints.sort(key=lambda x: x["score"], reverse=True)
        unique_endpoints = unique_endpoints[:top_k]

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "API explorer: query='%s' endpoints=%d time=%.1fms",
            query[:50],
            len(unique_endpoints),
            elapsed_ms,
        )

        return {
            "query": query,
            "endpoints": unique_endpoints,
            "total_endpoints": len(unique_endpoints),
            "execution_time_ms": round(elapsed_ms, 1),
        }


def _extract_endpoints(content: str, file_path: str) -> list[dict]:
    endpoints = []
    method_map = {
        "get": "GET",
        "post": "POST",
        "put": "PUT",
        "patch": "PATCH",
        "delete": "DELETE",
    }
    for match in ENDPOINT_PATTERN.finditer(content):
        method_raw = match.group(1).lower()
        endpoint = match.group(2)
        method = method_map.get(method_raw, method_raw.upper())

        desc = ""
        line_start = content.rfind("\n", 0, match.start()) + 1
        line_end = content.find("\n", match.end())
        full_line = content[line_start:line_end] if line_end != -1 else content[line_start:]
        desc_match = DESC_PATTERN.search(full_line)
        if desc_match:
            desc = desc_match.group(1)

        request_body = _extract_request_body(content, match.end())
        response_model = _extract_response_model(content, match.end())

        endpoints.append(
            {
                "method": method,
                "endpoint": endpoint,
                "description": desc,
                "file_path": file_path,
                "request_body": request_body,
                "response_model": response_model,
            }
        )

    return endpoints


def _extract_request_body(content: str, start: int) -> str:
    snippet = content[start : start + 500]
    body_match = re.search(r"request[_-]?body|body:\s*(\w+)", snippet, re.IGNORECASE)
    if body_match:
        return body_match.group(1) if body_match.group(1) else "request body"
    param_match = re.search(r"(\w+Request)", snippet)
    if param_match:
        return param_match.group(1)
    return ""


def _extract_response_model(content: str, start: int) -> str:
    snippet = content[start : start + 500]
    resp_match = re.search(r"response_model\s*=\s*(\w+)", snippet)
    if resp_match:
        return resp_match.group(1)
    return_match = re.search(r"->\s*(\w+)", snippet)
    if return_match:
        return return_match.group(1)
    return ""
