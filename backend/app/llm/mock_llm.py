from app.core.logging import get_logger
from app.llm.base import BaseLLM, LLMMessage, LLMResponse

logger = get_logger("llm.mock")


class MockLLM(BaseLLM):
    def __init__(self, model: str = "mock-gpt-4o"):
        self._model = model

    @property
    def model_name(self) -> str:
        return self._model

    async def chat(
        self,
        messages: list[LLMMessage],
        temperature: float = 0.1,
        max_tokens: int = 4096,
    ) -> LLMResponse:
        user_msg = ""
        has_context = False
        for m in messages:
            if m.role == "user":
                user_msg = m.content
                if "## Retrieved Knowledge Base Context" in m.content:
                    has_context = "[No relevant documents found]" not in m.content

        if has_context:
            import re

            sources = re.findall(r"Source: (.+)", user_msg)
            source_list = sources[:5] if sources else ["unknown"]

            main_files = [s for s in source_list if s.endswith(".py")][:2]
            sup_files = [s for s in source_list if s not in main_files][:3]

            main_block = (
                "\n".join(f"- `{f}` - core module" for f in main_files)
                or "- `app/` - application code"
            )
            sup_block = (
                "\n".join(f"- `{f}` - supporting module" for f in sup_files)
                or "- `app/` - supporting code"
            )
            ref_block = "\n".join(f"- {f}" for f in source_list)

            content = (
                f"Based on the retrieved knowledge base, here is the answer "
                f"regarding your query.\n\n"
                f"The documentation indicates this is handled through a modular "
                f"architecture with clear separation of concerns.\n\n"
                f"**Main implementation:**\n"
                f"{main_block}\n\n"
                f"**Supporting files:**\n"
                f"{sup_block}\n\n"
                f"**Source References:**\n"
                f"{ref_block}\n"
            )
        else:
            content = (
                "I don't have enough information in the knowledge base to answer "
                "this question. Please ensure documents have been indexed, or "
                "rephrase your query to better match the available content."
            )

        logger.info("Mock LLM response generated (has_context=%s)", has_context)

        return LLMResponse(
            content=content,
            model=self._model,
            usage={
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0,
            },
            finish_reason="stop",
        )
