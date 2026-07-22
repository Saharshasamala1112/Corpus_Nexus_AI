import httpx

from app.core.config import get_settings
from app.core.logging import get_logger
from app.llm.base import BaseLLM, LLMMessage, LLMResponse

logger = get_logger("llm.openai")

OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"


class OpenAILLM(BaseLLM):
    def __init__(self, api_key: str | None = None, model: str | None = None):
        settings = get_settings()
        self._api_key = api_key or settings.OPENAI_API_KEY
        self._model = model or settings.LLM_MODEL
        self._client = httpx.AsyncClient(
            timeout=httpx.Timeout(60.0, connect=10.0),
            headers={
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
            },
        )

    @property
    def model_name(self) -> str:
        return self._model

    async def chat(
        self,
        messages: list[LLMMessage],
        temperature: float = 0.1,
        max_tokens: int = 4096,
    ) -> LLMResponse:
        payload = {
            "model": self._model,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        logger.info("LLM request: model=%s messages=%d", self._model, len(messages))

        try:
            response = await self._client.post(OPENAI_API_URL, json=payload)
            response.raise_for_status()
            data = response.json()

            choice = data["choices"][0]
            usage = data.get("usage", {})

            logger.info(
                "LLM response: model=%s tokens=%s finish=%s",
                self._model,
                usage.get("total_tokens", "?"),
                choice.get("finish_reason", "?"),
            )

            return LLMResponse(
                content=choice["message"]["content"],
                model=self._model,
                usage={
                    "prompt_tokens": usage.get("prompt_tokens", 0),
                    "completion_tokens": usage.get("completion_tokens", 0),
                    "total_tokens": usage.get("total_tokens", 0),
                },
                finish_reason=choice.get("finish_reason", ""),
            )
        except httpx.HTTPStatusError as e:
            logger.error("OpenAI API error: %d %s", e.response.status_code, e.response.text[:200])
            raise
        except Exception as e:
            logger.error("LLM request failed: %s", e)
            raise

    async def close(self) -> None:
        await self._client.aclose()
