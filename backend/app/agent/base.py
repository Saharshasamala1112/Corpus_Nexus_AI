from abc import ABC, abstractmethod
from dataclasses import dataclass, field

from app.core.logging import get_logger
from app.schemas.agent import ToolType

logger = get_logger("agent.base")


@dataclass
class ToolDefinition:
    name: ToolType
    description: str
    parameters_schema: dict = field(default_factory=dict)
    examples: list[str] = field(default_factory=list)
    keywords: list[str] = field(default_factory=list)


class BaseTool(ABC):
    @property
    @abstractmethod
    def definition(self) -> ToolDefinition: ...

    @abstractmethod
    async def execute(self, parameters: dict) -> dict: ...

    def matches_query(self, query: str) -> float:
        """Return a relevance score (0.0-1.0) for how well this tool matches the query."""
        query_lower = query.lower()
        score = 0.0
        for keyword in self.definition.keywords:
            if keyword.lower() in query_lower:
                score += 0.15
        return min(score, 1.0)


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[ToolType, BaseTool] = {}

    def register(self, tool: BaseTool) -> None:
        defn = tool.definition
        self._tools[defn.name] = tool
        logger.info("Registered tool: %s", defn.name.value)

    def get(self, tool_type: ToolType) -> BaseTool | None:
        return self._tools.get(tool_type)

    def list_tools(self) -> list[ToolDefinition]:
        return [tool.definition for tool in self._tools.values()]

    def list_tool_types(self) -> list[ToolType]:
        return list(self._tools.keys())

    def score_tools(self, query: str) -> list[tuple[ToolType, float]]:
        scored = []
        for tool_type, tool in self._tools.items():
            score = tool.matches_query(query)
            if score > 0:
                scored.append((tool_type, score))
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored


_registry: ToolRegistry | None = None


def get_tool_registry() -> ToolRegistry:
    global _registry
    if _registry is None:
        _registry = ToolRegistry()
        from app.agent.tools import ALL_TOOLS

        for tool_cls in ALL_TOOLS:
            _registry.register(tool_cls())
    return _registry
