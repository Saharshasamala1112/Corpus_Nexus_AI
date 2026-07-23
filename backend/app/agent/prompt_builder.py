import json

from app.citation import compute_confidence, extract_citations
from app.core.logging import get_logger
from app.llm import BaseLLM, LLMMessage, get_llm
from app.schemas.agent import SourceReference, ToolCall

logger = get_logger("agent.prompt_builder")

AGENT_SYSTEM_PROMPT = """You are CorpusGuard AI Agent, an enterprise-grade agentic AI assistant specialized in codebase understanding, documentation analysis, and system architecture exploration.

## Core Directives

1. **NEVER hallucinate.** Only answer using information from the tool results provided. If the tools did not return enough information, explicitly state what is missing.

2. **Show your reasoning.** Explain the steps you took and why you chose specific tools.

3. **Cite sources.** Every claim must reference its source. Use the format:
   - **Main implementation:** `file_path` - description
   - **Supporting files:** `file_path` - description

4. **Structure your response clearly:**
   - Direct answer to the question
   - Detailed explanation with code references
   - Supporting documentation references
   - Source list

5. **Be thorough but concise.** Provide complete answers without unnecessary verbosity.

## Response Format

**Answer**
[Direct, comprehensive answer derived from tool results]

**Detailed Explanation**
[Technical details, code patterns, architecture notes]

**Main implementation:**
- `file_path` - role description

**Supporting files:**
- `file_path` - role description

**Source References:**
- file1.py
- file2.md
- ...
"""


class AgentPromptBuilder:
    def __init__(self, llm: BaseLLM | None = None):
        self.llm = llm or get_llm()

    async def build_response(
        self,
        query: str,
        tool_calls: list[ToolCall],
        reasoning_steps: list[dict],
    ) -> tuple[str, float, list[SourceReference]]:
        tool_results_context = self._format_tool_results(tool_calls)
        reasoning_context = self._format_reasoning(reasoning_steps)

        user_prompt = (
            f"## User Question\n\n{query}\n\n"
            f"## Reasoning Steps Taken\n\n{reasoning_context}\n\n"
            f"## Tool Results\n\n{tool_results_context}\n\n"
            f"## Instructions\n\n"
            f"Based on the tool results above, provide a comprehensive answer to the user's question. "
            f"Cite every source file you reference. "
            f"If the tool results are insufficient, explain what additional information would be needed."
        )

        try:
            llm_response = await self.llm.chat(
                messages=[
                    LLMMessage(role="system", content=AGENT_SYSTEM_PROMPT),
                    LLMMessage(role="user", content=user_prompt),
                ],
                temperature=0.1,
                max_tokens=4096,
            )
            answer = llm_response.content
        except Exception as e:
            logger.exception("LLM generation failed: %s", e)
            answer = self._fallback_response(query, tool_calls)

        sources = self._extract_sources(tool_calls)
        scores = self._extract_scores(tool_calls)
        citation_result = extract_citations(answer)
        confidence = compute_confidence(
            scores=scores,
            has_citations=bool(citation_result.source_references),
            has_context=bool(tool_calls),
        )

        if citation_result.source_references:
            for ref in citation_result.source_references:
                if not any(s.file_path == ref for s in sources):
                    sources.append(
                        SourceReference(
                            file_path=ref,
                            file_name=ref.split("/")[-1] if "/" in ref else ref,
                        )
                    )

        return answer, confidence, sources

    def _format_tool_results(self, tool_calls: list[ToolCall]) -> str:
        parts = []
        for i, tc in enumerate(tool_calls, 1):
            if not tc.success:
                parts.append(f"### Tool {i}: {tc.tool.value} (FAILED)\nError: {tc.error}\n")
                continue

            result = tc.result
            result_str = json.dumps(result, indent=2, default=str)
            if len(result_str) > 4000:
                result_str = result_str[:4000] + "\n... (truncated)"

            parts.append(
                f"### Tool {i}: {tc.tool.value}\n"
                f"Reasoning: {tc.reasoning}\n"
                f"Parameters: {json.dumps(tc.parameters)}\n"
                f"Execution time: {tc.execution_time_ms:.1f}ms\n"
                f"Results:\n```\n{result_str}\n```\n"
            )
        return "\n---\n".join(parts)

    def _format_reasoning(self, reasoning_steps: list[dict]) -> str:
        parts = []
        for step in reasoning_steps:
            tool_info = f" (Tool: {step.get('tool_used', 'N/A')})" if step.get("tool_used") else ""
            parts.append(
                f"Step {step.get('step', '?')}: {step.get('thought', '')}"
                f"{tool_info}\nAction: {step.get('action', '')}"
            )
        return "\n\n".join(parts)

    def _extract_sources(self, tool_calls: list[ToolCall]) -> list[SourceReference]:
        sources = []
        seen = set()
        for tc in tool_calls:
            if not tc.success:
                continue
            result = tc.result
            for key in [
                "results",
                "endpoints",
                "tables",
                "projects",
                "setup_steps",
                "documentation_references",
                "setup_sources",
                "configs",
                "docker_configs",
                "redis_configs",
                "celery_configs",
                "other_configs",
            ]:
                items = result.get(key, [])
                if isinstance(items, list):
                    for item in items:
                        if isinstance(item, dict):
                            path = item.get("path", item.get("file_path", ""))
                            if path and path not in seen:
                                seen.add(path)
                                sources.append(
                                    SourceReference(
                                        file_path=path,
                                        file_name=path.split("/")[-1] if "/" in path else path,
                                        score=item.get("score", 0.0),
                                    )
                                )
        return sources

    def _extract_scores(self, tool_calls: list[ToolCall]) -> list[float]:
        scores = []
        for tc in tool_calls:
            if not tc.success:
                continue
            result = tc.result
            for key in ["results", "endpoints", "tables", "projects"]:
                items = result.get(key, [])
                if isinstance(items, list):
                    for item in items:
                        if isinstance(item, dict) and "score" in item:
                            scores.append(item["score"])
        return scores if scores else [0.5]

    def _fallback_response(self, query: str, tool_calls: list[ToolCall]) -> str:
        parts = ["**Answer**\n"]
        tool_summaries = []
        for tc in tool_calls:
            if tc.success:
                result_summary = json.dumps(tc.result, indent=2, default=str)[:1000]
                tool_summaries.append(
                    f"- **{tc.tool.value}**: {tc.reasoning}\n```\n{result_summary}\n```"
                )
        if tool_summaries:
            parts.append("Information gathered from the following tools:\n")
            parts.extend(tool_summaries)
        else:
            parts.append("No tool results were available to answer this question.")
        return "\n".join(parts)


_builder: AgentPromptBuilder | None = None


def get_agent_prompt_builder() -> AgentPromptBuilder:
    global _builder
    if _builder is None:
        _builder = AgentPromptBuilder()
    return _builder
