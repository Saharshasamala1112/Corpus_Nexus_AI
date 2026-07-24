import time

from app.agent.base import BaseTool, ToolDefinition
from app.core.logging import get_logger
from app.retrieval import RetrievalResult, SemanticSearch
from app.schemas.agent import ToolType

logger = get_logger("agent.tools.setup_guide")


class SetupGuideTool(BaseTool):
    @property
    def definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=ToolType.SETUP_GUIDE,
            description=(
                "Generate step-by-step project setup instructions by analyzing README files, "
                "configuration files, and documentation to produce comprehensive setup guides."
            ),
            parameters_schema={
                "query": {
                    "type": "string",
                    "description": "What project or component to generate setup instructions for",
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
                "How do I set up the project?",
                "Generate setup instructions for the backend",
                "What are the prerequisites to run this project?",
                "Steps to get the development environment running",
            ],
            keywords=[
                "setup",
                "install",
                "getting started",
                "prerequisites",
                "requirements",
                "development environment",
                "run",
                "start",
                "configure",
                "configuration",
                "bootstrap",
                "init",
                "clone",
                "docker compose up",
                "make install",
                "npm install",
                "pip install",
            ],
        )

    def matches_query(self, query: str) -> float:
        score = super().matches_query(query)
        query_lower = query.lower()
        setup_terms = [
            "setup",
            "install",
            "getting started",
            "prerequisites",
            "how do i run",
            "how to run",
            "development environment",
            "setup instructions",
            "getting started guide",
            "bootstrap",
        ]
        for term in setup_terms:
            if term in query_lower:
                score += 0.25
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

        setup_sections = []
        infrastructure_hints = []
        config_files = []

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
                "document_type": meta.get("document_type", ""),
            }

            filename_lower = filename.lower()
            if any(kw in filename_lower for kw in ["readme", "setup", "install", "getting"]):
                setup_sections.append(entry)
            elif any(
                kw in filename_lower
                for kw in [
                    "dockerfile",
                    "docker-compose",
                    ".env",
                    "requirements",
                    "package.json",
                    "pyproject",
                ]
            ):
                config_files.append(entry)
            else:
                infrastructure_hints.append(entry)

        steps = _build_setup_steps(setup_sections, config_files, infrastructure_hints)

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "Setup guide: query='%s' steps=%d time=%.1fms",
            query[:50],
            len(steps),
            elapsed_ms,
        )

        return {
            "query": query,
            "setup_steps": steps,
            "setup_sources": [
                {"file": s["file"], "path": s["path"], "score": s["score"]}
                for s in setup_sections + config_files
            ],
            "total_sources": len(setup_sections) + len(config_files),
            "execution_time_ms": round(elapsed_ms, 1),
        }


def _build_setup_steps(
    setup_sections: list[dict],
    config_files: list[dict],
    infrastructure_hints: list[dict],
) -> list[dict]:
    steps = []
    step_num = 1

    prereqs = []
    for section in setup_sections:
        content = section["content"]
        content_lower = content.lower()
        if any(
            kw in content_lower
            for kw in ["prerequisite", "requirement", "before you begin", "before starting"]
        ):
            prereqs.append(section)

    if prereqs:
        steps.append(
            {
                "step": step_num,
                "title": "Prerequisites",
                "description": prereqs[0]["content"][:2000],
                "source_file": prereqs[0]["file"],
            }
        )
        step_num += 1

    for section in setup_sections:
        content = section["content"]
        if section in prereqs:
            continue
        steps.append(
            {
                "step": step_num,
                "title": f"Setup Instructions ({section['file']})",
                "description": content[:2000],
                "source_file": section["file"],
            }
        )
        step_num += 1

    for config in config_files[:3]:
        steps.append(
            {
                "step": step_num,
                "title": f"Configuration ({config['file']})",
                "description": config["content"][:1500],
                "source_file": config["file"],
            }
        )
        step_num += 1

    if not steps:
        steps.append(
            {
                "step": 1,
                "title": "No Setup Documentation Found",
                "description": "No README, setup guide, or installation documentation was found in the indexed knowledge base.",
                "source_file": "",
            }
        )

    return steps
