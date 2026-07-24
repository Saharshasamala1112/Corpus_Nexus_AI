from app.core.config import get_settings
from app.core.logging import get_logger
from app.llm.base import BaseLLM
from app.llm.base import LLMMessage as LLMMessage
from app.llm.base import LLMResponse as LLMResponse

logger = get_logger("llm")

_llm: BaseLLM | None = None


def get_llm() -> BaseLLM:
    global _llm
    if _llm is None:
        settings = get_settings()
        provider = settings.LLM_PROVIDER.lower()

        if provider == "ollama":
            from app.llm.ollama_llm import OllamaLLM

            _llm = OllamaLLM()
            logger.info(
                "Using Ollama LLM: %s (%s)", settings.OLLAMA_MODEL, settings.OLLAMA_BASE_URL
            )
        elif provider == "openai" and settings.OPENAI_API_KEY:
            from app.llm.openai_llm import OpenAILLM

            _llm = OpenAILLM()
            logger.info("Using OpenAI LLM: %s", settings.LLM_MODEL)
        else:
            from app.llm.mock_llm import MockLLM

            _llm = MockLLM()
            logger.info("Using Mock LLM (no valid provider configured)")
    return _llm


def set_llm(llm: BaseLLM) -> None:
    global _llm
    _llm = llm
