from app.llm.base import BaseLLM, LLMMessage, LLMResponse
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("llm")

_llm: BaseLLM | None = None


def get_llm() -> BaseLLM:
    global _llm
    if _llm is None:
        settings = get_settings()
        if settings.OPENAI_API_KEY:
            from app.llm.openai_llm import OpenAILLM

            _llm = OpenAILLM()
            logger.info("Using OpenAI LLM: %s", settings.LLM_MODEL)
        else:
            from app.llm.mock_llm import MockLLM

            _llm = MockLLM()
            logger.info("Using Mock LLM (no OPENAI_API_KEY set)")
    return _llm


def set_llm(llm: BaseLLM) -> None:
    global _llm
    _llm = llm
