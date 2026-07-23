import asyncio

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger
from app.llm.base import BaseLLM, LLMMessage, LLMResponse

logger = get_logger("llm.openai")

OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
DEFAULT_MAX_RETRIES = 2


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

    async def _request_with_retry(self, url: str, json_payload: dict) -> httpx.Response:
        last_exc: Exception | None = None
        for attempt in range(1 + DEFAULT_MAX_RETRIES):
            try:
                response = await self._client.post(url, json=json_payload)
                response.raise_for_status()
                return response
            except (httpx.TimeoutException, httpx.ConnectError, httpx.HTTPStatusError) as e:
                last_exc = e
                if attempt < DEFAULT_MAX_RETRIES:
                    wait = 1.0 * (2**attempt)
                    logger.warning(
                        "OpenAI attempt %d/%d failed: %s. Retrying in %.1fs",
                        attempt + 1,
                        1 + DEFAULT_MAX_RETRIES,
                        e,
                        wait,
                    )
                    await asyncio.sleep(wait)
                else:
                    logger.error(
                        "OpenAI request failed after %d retries: %s",
                        1 + DEFAULT_MAX_RETRIES,
                        e,
                    )
        raise last_exc

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
            response = await self._request_with_retry(OPENAI_API_URL, payload)
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

    async def chat_stream(
        self,
        messages: list[LLMMessage],
        temperature: float = 0.1,
        max_tokens: int = 4096,
    ):
        payload = {
            "model": self._model,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        }

        last_exc: Exception | None = None
        for attempt in range(1 + DEFAULT_MAX_RETRIES):
            try:
                async with self._client.stream("POST", OPENAI_API_URL, json=payload) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if not line.strip():
                            continue
                        if line.startswith("data: "):
                            data_str = line[6:].strip()
                            if data_str == "[DONE]":
                                return
                            try:
                                import json

                                chunk = json.loads(data_str)
                                delta = chunk.get("choices", [{}])[0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    yield content
                            except json.JSONDecodeError:
                                continue
                    return
            except (httpx.TimeoutException, httpx.ConnectError, httpx.HTTPStatusError) as e:
                last_exc = e
                if attempt < DEFAULT_MAX_RETRIES:
                    wait = 1.0 * (2**attempt)
                    await asyncio.sleep(wait)
        if last_exc:
            raise last_exc

    async def close(self) -> None:
        await self._client.aclose()
