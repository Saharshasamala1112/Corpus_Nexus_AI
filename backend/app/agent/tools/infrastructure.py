import re
import time

from app.agent.base import BaseTool, ToolDefinition
from app.retrieval import SemanticSearch, RetrievalResult
from app.schemas.agent import ToolType
from app.core.logging import get_logger

logger = get_logger("agent.tools.infrastructure")

INFRA_COMPONENTS = {
    "docker": ["docker", "dockerfile", "container", "image", "docker-compose"],
    "redis": ["redis", "cache", "caching", "session store"],
    "celery": ["celery", "task queue", "worker", "beat", "async task", "broker"],
    "minio": ["minio", "s3", "object storage", "bucket"],
    "nginx": ["nginx", "reverse proxy", "load balancer", "upstream"],
    "postgres": ["postgresql", "postgres", "database", "psql"],
    "env": ["environment variable", "env var", "env file", ".env", "config"],
    "compose": ["docker compose", "docker-compose", "compose file", "services"],
}


class InfrastructureTool(BaseTool):
    @property
    def definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=ToolType.INFRASTRUCTURE,
            description=(
                "Analyze infrastructure configuration including Docker, Docker Compose, "
                "Redis, Celery, MinIO, Nginx, and environment variables."
            ),
            parameters_schema={
                "query": {
                    "type": "string",
                    "description": "What to search for in infrastructure configuration",
                },
                "top_k": {
                    "type": "integer",
                    "description": "Maximum results to return (default 10)",
                    "default": 10,
                },
                "component": {
                    "type": "string",
                    "description": "Specific component: docker, redis, celery, minio, nginx, env, compose, postgres",
                },
                "repository": {
                    "type": "string",
                    "description": "Optional repository name to scope search",
                },
            },
            examples=[
                "Show me the Docker configuration",
                "How is Redis configured?",
                "What environment variables are needed?",
                "Show Celery setup",
            ],
            keywords=[
                "docker", "dockerfile", "compose", "redis", "celery", "minio",
                "nginx", "infrastructure", "deployment", "container", "environment",
                "env", "config", "configuration", "setup", "devops", "ops",
            ],
        )

    def matches_query(self, query: str) -> float:
        score = super().matches_query(query)
        query_lower = query.lower()
        for component, keywords in INFRA_COMPONENTS.items():
            for kw in keywords:
                if kw in query_lower:
                    score += 0.2
                    break
        return min(score, 1.0)

    async def execute(self, parameters: dict) -> dict:
        start = time.perf_counter()
        query = parameters.get("query", "")
        top_k = parameters.get("top_k", 10)
        component = parameters.get("component", "").lower()
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

        docker_configs = []
        redis_configs = []
        celery_configs = []
        minio_configs = []
        env_variables = []
        compose_configs = []
        other_configs = []

        for r in results:
            meta = r.metadata
            content = r.content
            file_path = meta.get("file_path", "")
            filename = meta.get("filename", "")

            entry = {
                "file": filename,
                "path": file_path,
                "repository": meta.get("repository", ""),
                "score": round(r.score, 4),
                "content": content,
            }

            file_lower = (file_path + " " + filename).lower()
            content_lower = content.lower()

            if "dockerfile" in file_lower or "docker-compose" in file_lower:
                docker_configs.append(entry)
            elif any(k in content_lower for k in ["redis", "cache"]) and any(k in content_lower for k in ["host", "port", "url"]):
                redis_configs.append(entry)
            elif any(k in content_lower for k in ["celery", "broker", "worker"]):
                celery_configs.append(entry)
            elif "minio" in content_lower or "s3" in content_lower:
                minio_configs.append(entry)
            elif "env" in file_lower or ".env" in file_lower:
                env_variables.extend(_extract_env_vars(content))
            elif "compose" in file_lower:
                compose_configs.append(entry)
            else:
                other_configs.append(entry)

        response = {
            "query": query,
            "execution_time_ms": 0,
        }

        if not component or component in ("docker", "compose"):
            response["docker_configs"] = docker_configs
            response["compose_configs"] = compose_configs
        if not component or component == "redis":
            response["redis_configs"] = redis_configs
        if not component or component == "celery":
            response["celery_configs"] = celery_configs
        if not component or component == "minio":
            response["minio_configs"] = minio_configs
        if not component or component == "env":
            response["env_variables"] = env_variables

        response["other_configs"] = other_configs
        elapsed_ms = (time.perf_counter() - start) * 1000
        response["execution_time_ms"] = round(elapsed_ms, 1)

        logger.info(
            "Infrastructure search: query='%s' component=%s time=%.1fms",
            query[:50], component or "all", elapsed_ms,
        )

        return response


def _extract_env_vars(content: str) -> list[dict]:
    env_vars = []
    patterns = [
        re.compile(r"^(\w+)=(.+)$", re.MULTILINE),
        re.compile(r"(?:export\s+)?(\w+)=(.+)$", re.MULTILINE),
        re.compile(r"""(\w+)\s*[=:]\s*["']?([^"'\n]+)["']?"""),
    ]
    seen = set()
    for pattern in patterns:
        for match in pattern.finditer(content):
            name = match.group(1)
            value = match.group(2).strip()
            if name in seen or name.startswith("#") or len(name) < 3:
                continue
            seen.add(name)
            env_vars.append({
                "name": name,
                "value": value if len(value) < 100 else value[:100] + "...",
                "has_secret": any(s in name.lower() for s in ["key", "secret", "password", "token"]),
            })
    return env_vars
