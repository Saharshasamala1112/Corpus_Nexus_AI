import time

from app.agent.base import ToolRegistry, get_tool_registry
from app.core.logging import get_logger
from app.schemas.agent import ToolCall, ToolType

logger = get_logger("agent.executor")


class ToolExecutor:
    def __init__(self, registry: ToolRegistry | None = None):
        self.registry = registry or get_tool_registry()

    async def execute_plan(self, plan: list[dict]) -> list[ToolCall]:
        tool_calls: list[ToolCall] = []

        for tool_plan in plan:
            tool_type_str = tool_plan.get("tool", "")
            reasoning = tool_plan.get("reasoning", "")
            parameters = tool_plan.get("parameters", {})

            try:
                tool_type = ToolType(tool_type_str)
            except ValueError:
                logger.warning("Unknown tool type: %s", tool_type_str)
                tool_calls.append(
                    ToolCall(
                        tool=ToolType.REPOSITORY_SEARCH,
                        reasoning=reasoning,
                        parameters=parameters,
                        result={"error": f"Unknown tool type: {tool_type_str}"},
                        success=False,
                        error=f"Unknown tool type: {tool_type_str}",
                    )
                )
                continue

            tool = self.registry.get(tool_type)
            if tool is None:
                logger.warning("Tool not registered: %s", tool_type_str)
                tool_calls.append(
                    ToolCall(
                        tool=tool_type,
                        reasoning=reasoning,
                        parameters=parameters,
                        result={"error": f"Tool not registered: {tool_type_str}"},
                        success=False,
                        error=f"Tool not registered: {tool_type_str}",
                    )
                )
                continue

            start = time.perf_counter()
            try:
                result = await tool.execute(parameters)
                elapsed_ms = (time.perf_counter() - start) * 1000

                tool_calls.append(
                    ToolCall(
                        tool=tool_type,
                        reasoning=reasoning,
                        parameters=parameters,
                        result=result,
                        execution_time_ms=round(elapsed_ms, 1),
                        success=True,
                    )
                )

                logger.info(
                    "Tool executed: %s time=%.1fms success=True",
                    tool_type.value,
                    elapsed_ms,
                )

            except Exception as e:
                elapsed_ms = (time.perf_counter() - start) * 1000
                logger.exception("Tool execution failed: %s", tool_type_str)

                tool_calls.append(
                    ToolCall(
                        tool=tool_type,
                        reasoning=reasoning,
                        parameters=parameters,
                        result={"error": str(e)},
                        execution_time_ms=round(elapsed_ms, 1),
                        success=False,
                        error=f"{type(e).__name__}: {e}",
                    )
                )

        return tool_calls

    def get_available_tools(self) -> list[dict]:
        tools = self.registry.list_tools()
        return [
            {
                "name": t.name.value,
                "description": t.description,
                "examples": t.examples,
            }
            for t in tools
        ]


_executor: ToolExecutor | None = None


def get_tool_executor() -> ToolExecutor:
    global _executor
    if _executor is None:
        _executor = ToolExecutor()
    return _executor
