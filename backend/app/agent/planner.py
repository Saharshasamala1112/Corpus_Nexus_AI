from app.agent.base import ToolRegistry, get_tool_registry
from app.core.logging import get_logger
from app.llm import BaseLLM, LLMMessage, get_llm
from app.schemas.agent import ReasoningStep, ToolType

logger = get_logger("agent.planner")

PLANNER_SYSTEM_PROMPT = """You are an intelligent AI Agent planner for the CorpusGuard system.

Your task: Analyze the user's question and decide which tools to invoke to gather the information needed.

## Available Tools

{tools_description}

## Planning Rules

1. **Reason before acting.** Think step by step about what information is needed.
2. **Select the minimum tools** necessary. Don't invoke tools that won't help.
3. **Chain tools** when one tool's output feeds into the next.
4. **Be specific** about what parameters to pass to each tool.
5. If the question is conversational and doesn't need tools, return an empty plan.

## Output Format

Return ONLY a valid JSON array of tool plan objects. Each object has:
- "tool": tool type name (one of the tool names listed above)
- "reasoning": why this tool is being invoked
- "parameters": dict of parameters to pass (use "query" key with the relevant search terms)

Example:
[
    {{"tool": "repository_search", "reasoning": "Need to find authentication code", "parameters": {{"query": "authentication middleware"}}},
    {{"tool": "documentation_search", "reasoning": "Need to find auth documentation", "parameters": {{"query": "authentication setup guide"}}}}
]

If no tools are needed, return an empty array: []
"""


class AgentPlanner:
    def __init__(
        self,
        registry: ToolRegistry | None = None,
        llm: BaseLLM | None = None,
    ):
        self.registry = registry or get_tool_registry()
        self.llm = llm or get_llm()

    async def plan(self, query: str, max_tools: int = 5) -> tuple[list[dict], list[ReasoningStep]]:
        steps: list[ReasoningStep] = []

        steps.append(
            ReasoningStep(
                step=1,
                thought=f"Analyzing user query: '{query}'",
                action="Query analysis",
            )
        )

        heuristic_plan = self._heuristic_plan(query)

        if not heuristic_plan:
            steps.append(
                ReasoningStep(
                    step=2,
                    thought="No tools needed for this query. Will generate a direct response.",
                    action="Skip tool execution",
                )
            )
            return [], steps

        tools_desc = self._build_tools_description()
        prompt = PLANNER_SYSTEM_PROMPT.format(tools_description=tools_desc)
        user_msg = f"Plan the tools needed to answer this question:\n\n{query}"

        try:
            llm_response = await self.llm.chat(
                messages=[
                    LLMMessage(role="system", content=prompt),
                    LLMMessage(role="user", content=user_msg),
                ],
                temperature=0.1,
                max_tokens=2048,
            )

            plan = self._parse_plan(llm_response.content)

            if not plan:
                logger.info("LLM returned empty plan, falling back to heuristic")
                plan = heuristic_plan
                steps.append(
                    ReasoningStep(
                        step=2,
                        thought="LLM planner returned empty plan. Using keyword-based heuristic fallback.",
                        action="Heuristic fallback",
                    )
                )
            else:
                steps.append(
                    ReasoningStep(
                        step=2,
                        thought=f"LLM decided to use {len(plan)} tool(s): {[p['tool'] for p in plan]}",
                        action="Tool selection via LLM reasoning",
                    )
                )

            plan = plan[:max_tools]

        except Exception as e:
            logger.warning("LLM planning failed: %s, using heuristic", e)
            plan = heuristic_plan
            steps.append(
                ReasoningStep(
                    step=2,
                    thought=f"LLM planning failed ({type(e).__name__}). Using heuristic fallback.",
                    action="Heuristic fallback",
                )
            )

        for i, tool_plan in enumerate(plan):
            tool_type = tool_plan.get("tool", "")
            try:
                tt = ToolType(tool_type)
                steps.append(
                    ReasoningStep(
                        step=3 + i,
                        thought=tool_plan.get("reasoning", ""),
                        action=f"Will execute {tool_type}",
                        tool_used=tt,
                    )
                )
            except ValueError:
                logger.warning("Unknown tool type in plan: %s", tool_type)

        return plan, steps

    def _heuristic_plan(self, query: str) -> list[dict]:
        scored = self.registry.score_tools(query)
        plan = []
        seen_types = set()
        for tool_type, score in scored:
            if score < 0.15 or tool_type in seen_types:
                continue
            seen_types.add(tool_type)
            plan.append(
                {
                    "tool": tool_type.value,
                    "reasoning": f"Query matches keywords for {tool_type.value}",
                    "parameters": {"query": query},
                }
            )
        return plan

    def _build_tools_description(self) -> str:
        tools = self.registry.list_tools()
        lines = []
        for t in tools:
            lines.append(f"- **{t.name.value}**: {t.description}")
            if t.examples:
                lines.append(f"  Examples: {', '.join(t.examples[:2])}")
        return "\n".join(lines)

    def _parse_plan(self, llm_output: str) -> list[dict]:
        import json

        text = llm_output.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            lines = [line for line in lines if not line.strip().startswith("```")]
            text = "\n".join(lines)
        try:
            parsed = json.loads(text)
            if isinstance(parsed, list):
                valid = []
                known_tools = {t.value for t in ToolType}
                for item in parsed:
                    if isinstance(item, dict) and item.get("tool") in known_tools:
                        valid.append(item)
                return valid
        except (json.JSONDecodeError, TypeError):
            logger.warning("Failed to parse LLM plan output as JSON")
        return []


_planner: AgentPlanner | None = None


def get_agent_planner() -> AgentPlanner:
    global _planner
    if _planner is None:
        _planner = AgentPlanner()
    return _planner
