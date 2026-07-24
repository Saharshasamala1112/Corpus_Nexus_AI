import time

from app.agent.base import BaseTool, ToolDefinition
from app.core.logging import get_logger
from app.metadata import MetadataStore
from app.retrieval import RetrievalResult, SemanticSearch
from app.schemas.agent import ToolType

logger = get_logger("agent.tools.project_explorer")


class ProjectExplorerTool(BaseTool):
    @property
    def definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=ToolType.PROJECT_EXPLORER,
            description=(
                "Explore projects in the workspace: ownership, descriptions, dependencies, "
                "technologies used, and project status from metadata and documentation."
            ),
            parameters_schema={
                "query": {
                    "type": "string",
                    "description": "What to learn about projects",
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
                "List all projects",
                "What projects use Python?",
                "Show project dependencies",
                "Who owns the backend project?",
            ],
            keywords=[
                "project",
                "owner",
                "description",
                "dependencies",
                "status",
                "module",
                "package",
                "workspace",
                "monorepo",
                "microservice",
                "technology",
                "stack",
                "framework",
                "library",
            ],
        )

    def matches_query(self, query: str) -> float:
        score = super().matches_query(query)
        query_lower = query.lower()
        project_terms = [
            "project",
            "workspace",
            "module",
            "package",
            "repository",
            "monorepo",
            "microservice",
            "who owns",
            "dependencies",
        ]
        for term in project_terms:
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

        metadata_store = MetadataStore()
        all_metadata = metadata_store.list_all(repository=repository)

        projects = _aggregate_projects(results, all_metadata)

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "Project explorer: query='%s' projects=%d time=%.1fms",
            query[:50],
            len(projects),
            elapsed_ms,
        )

        return {
            "query": query,
            "projects": projects,
            "total_projects": len(projects),
            "execution_time_ms": round(elapsed_ms, 1),
        }


def _aggregate_projects(
    results: list[RetrievalResult],
    metadata: list,
) -> list[dict]:
    project_map: dict[str, dict] = {}

    for meta in metadata:
        repo = meta.repository or "unknown"
        if repo not in project_map:
            project_map[repo] = {
                "project": repo,
                "owner": "",
                "description": "",
                "languages": set(),
                "technologies": set(),
                "dependencies": [],
                "file_count": 0,
                "status": "indexed",
            }
        project_map[repo]["languages"].add(meta.language)
        project_map[repo]["file_count"] += 1

    for r in results:
        meta = r.metadata
        repo = meta.get("repository", "unknown")
        if repo not in project_map:
            project_map[repo] = {
                "project": repo,
                "owner": "",
                "description": "",
                "languages": set(),
                "technologies": set(),
                "dependencies": [],
                "file_count": 0,
                "status": "indexed",
            }
        lang = meta.get("language", "")
        if lang:
            project_map[repo]["languages"].add(lang)

        content_lower = r.content.lower()
        tech_keywords = {
            "fastapi": "FastAPI",
            "django": "Django",
            "flask": "Flask",
            "react": "React",
            "vue": "Vue",
            "angular": "Angular",
            "postgresql": "PostgreSQL",
            "redis": "Redis",
            "celery": "Celery",
            "docker": "Docker",
            "kubernetes": "Kubernetes",
            "sqlalchemy": "SQLAlchemy",
            "pydantic": "Pydantic",
        }
        for kw, tech in tech_keywords.items():
            if kw in content_lower:
                project_map[repo]["technologies"].add(tech)

    projects = []
    for _repo_name, info in project_map.items():
        info["languages"] = sorted(info["languages"])
        info["technologies"] = sorted(info["technologies"])
        projects.append(info)

    projects.sort(key=lambda x: x["file_count"], reverse=True)
    return projects
