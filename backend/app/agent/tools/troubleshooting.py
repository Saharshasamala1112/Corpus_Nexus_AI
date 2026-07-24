import time

from app.agent.base import BaseTool, ToolDefinition
from app.core.logging import get_logger
from app.retrieval import RetrievalResult, SemanticSearch
from app.schemas.agent import ToolType

logger = get_logger("agent.tools.troubleshooting")

COMMON_ISSUES = {
    "backend_not_starting": {
        "keywords": [
            "backend not starting",
            "server won't start",
            "app won't start",
            "failed to start",
            "startup error",
        ],
        "diagnosis_steps": [
            "Check if all required environment variables are set (OPENAI_API_KEY, DATABASE_URL, etc.)",
            "Verify Python dependencies are installed: pip install -r requirements.txt",
            "Check for port conflicts: another process may be using port 8001",
            "Review application logs for specific error messages",
            "Ensure database is accessible and connection string is correct",
        ],
    },
    "database_connection_failed": {
        "keywords": [
            "database connection failed",
            "cannot connect to database",
            "db connection",
            "connection refused",
            "psycopg2",
            "sqlalchemy",
        ],
        "diagnosis_steps": [
            "Verify DATABASE_URL is correctly set in environment or .env file",
            "For PostgreSQL: ensure the server is running and accepting connections",
            "For SQLite: verify the database file path is correct and writable",
            "Check if database exists and migrations have been applied",
            "Verify firewall rules if connecting to a remote database",
        ],
    },
    "docker_compose_failed": {
        "keywords": [
            "docker compose failed",
            "docker-compose error",
            "container won't start",
            "docker build failed",
            "compose up failed",
        ],
        "diagnosis_steps": [
            "Run 'docker compose config' to validate the compose file syntax",
            "Check if required ports are available (not blocked by other services)",
            "Ensure all required environment variables are defined",
            "Run 'docker compose build --no-cache' to rebuild images",
            "Check Docker daemon is running: systemctl status docker",
        ],
    },
    "redis_unavailable": {
        "keywords": [
            "redis unavailable",
            "redis connection",
            "redis refused",
            "cache error",
            "redis not running",
        ],
        "diagnosis_steps": [
            "Verify Redis is running: redis-cli ping (should return PONG)",
            "Check REDIS_URL configuration matches your Redis instance",
            "Ensure Redis port (default 6379) is not blocked by firewall",
            "For Docker: check Redis container status with 'docker ps'",
            "Check Redis logs for memory or connection limits",
        ],
    },
    "import_error": {
        "keywords": [
            "import error",
            "module not found",
            "cannot import",
            "nameerror",
            "modulenotfounderror",
        ],
        "diagnosis_steps": [
            "Verify the package is installed: pip list | grep <package>",
            "Install missing dependency: pip install <package_name>",
            "Check if virtual environment is activated",
            "Verify requirements.txt includes the missing package",
            "Check for circular imports in your code",
        ],
    },
}


class TroubleshootingTool(BaseTool):
    @property
    def definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=ToolType.TROUBLESHOOTING,
            description=(
                "Diagnose and troubleshoot common setup and deployment issues. "
                "Searches indexed documentation and known issue patterns to provide solutions."
            ),
            parameters_schema={
                "query": {
                    "type": "string",
                    "description": "Description of the error or issue being encountered",
                },
                "top_k": {
                    "type": "integer",
                    "description": "Maximum documentation chunks to retrieve (default 10)",
                    "default": 10,
                },
                "repository": {
                    "type": "string",
                    "description": "Optional repository name to scope search",
                },
            },
            examples=[
                "Backend is not starting",
                "Database connection failed",
                "Docker compose is failing",
                "Redis is unavailable",
                "I'm getting an import error",
            ],
            keywords=[
                "error",
                "issue",
                "problem",
                "failed",
                "broken",
                "not working",
                "troubleshoot",
                "debug",
                "fix",
                "resolve",
                "diagnose",
                "backend not starting",
                "database connection",
                "docker compose",
                "redis",
                "import error",
                "exception",
                "traceback",
            ],
        )

    def matches_query(self, query: str) -> float:
        score = super().matches_query(query)
        query_lower = query.lower()
        error_terms = [
            "error",
            "issue",
            "problem",
            "failed",
            "broken",
            "not working",
            "troubleshoot",
            "debug",
            "fix",
            "resolve",
            "exception",
        ]
        for term in error_terms:
            if term in query_lower:
                score += 0.2
        for _issue_type, info in COMMON_ISSUES.items():
            for kw in info["keywords"]:
                if kw in query_lower:
                    score += 0.3
                    break
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

        matched_issues = _match_known_issues(query)
        documentation_context = []
        for r in results:
            documentation_context.append(
                {
                    "file": r.metadata.get("filename", ""),
                    "path": r.metadata.get("file_path", ""),
                    "score": round(r.score, 4),
                    "content": r.content,
                }
            )

        diagnosis = _build_diagnosis(matched_issues, documentation_context)

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "Troubleshooting: query='%s' issues=%d time=%.1fms",
            query[:50],
            len(matched_issues),
            elapsed_ms,
        )

        return {
            "query": query,
            "diagnosis": diagnosis,
            "matched_known_issues": [issue["name"] for issue in matched_issues],
            "documentation_references": [
                {"file": doc["file"], "path": doc["path"], "score": doc["score"]}
                for doc in documentation_context[:5]
            ],
            "execution_time_ms": round(elapsed_ms, 1),
        }


def _match_known_issues(query: str) -> list[dict]:
    query_lower = query.lower()
    matched = []
    for issue_name, info in COMMON_ISSUES.items():
        for keyword in info["keywords"]:
            if keyword in query_lower:
                matched.append({"name": issue_name, "info": info})
                break
    return matched


def _build_diagnosis(
    matched_issues: list[dict],
    documentation_context: list[dict],
) -> dict:
    steps = []
    if matched_issues:
        for issue in matched_issues:
            steps.extend(issue["info"]["diagnosis_steps"])
    else:
        steps.append("Review application logs for specific error messages")
        steps.append("Check that all required services are running")
        steps.append("Verify environment configuration is correct")

    if documentation_context:
        steps.append("Refer to the relevant documentation files for project-specific guidance")

    return {
        "issue_detected": bool(matched_issues),
        "diagnosis_steps": steps,
        "related_documentation": [
            {"file": doc["file"], "content_preview": doc["content"][:500]}
            for doc in documentation_context[:3]
        ],
    }
