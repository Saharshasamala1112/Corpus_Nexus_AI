import asyncio
import json

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger
from app.llm.base import BaseLLM, LLMMessage, LLMResponse

logger = get_logger("llm.ollama")


class OllamaLLM(BaseLLM):
    def __init__(
        self,
        base_url: str | None = None,
        model: str | None = None,
    ):
        settings = get_settings()
        self._base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self._model = model or settings.OLLAMA_MODEL
        self._max_retries = getattr(settings, "OLLAMA_MAX_RETRIES", 2)
        self._timeout_seconds = getattr(settings, "OLLAMA_TIMEOUT_SECONDS", 120)
        limits = httpx.Limits(max_keepalive_connections=5, max_connections=20)
        self._client = httpx.AsyncClient(
            timeout=httpx.Timeout(self._timeout_seconds, connect=10.0),
            headers={"Content-Type": "application/json"},
            limits=limits,
        )

    @property
    def model_name(self) -> str:
        return self._model

    async def _request_with_retry(
        self,
        url: str,
        json_payload: dict,
    ) -> httpx.Response:
        last_exc: Exception | None = None
        for attempt in range(1 + self._max_retries):
            try:
                response = await self._client.post(url, json=json_payload)
                response.raise_for_status()
                return response
            except (httpx.TimeoutException, httpx.ConnectError, httpx.HTTPStatusError) as e:
                last_exc = e
                if attempt < self._max_retries:
                    wait = 1.0 * (2**attempt)
                    logger.warning(
                        "Ollama attempt %d/%d failed: %s. Retrying in %.1fs",
                        attempt + 1,
                        1 + self._max_retries,
                        e,
                        wait,
                    )
                    await asyncio.sleep(wait)
                else:
                    logger.error(
                        "Ollama request failed after %d retries: %s", 1 + self._max_retries, e
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
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
            "stream": False,
        }

        logger.info(
            "Ollama request: model=%s messages=%d",
            self._model,
            len(messages),
        )

        response = await self._request_with_retry(
            f"{self._base_url}/api/chat",
            payload,
        )
        data = response.json()

        content = data.get("message", {}).get("content", "")
        finish_reason = data.get("done_reason", "stop")

        logger.info(
            "Ollama response: model=%s finish=%s",
            self._model,
            finish_reason,
        )

        return LLMResponse(
            content=content,
            model=self._model,
            usage={
                "prompt_tokens": data.get("prompt_eval_count", 0),
                "completion_tokens": data.get("eval_count", 0),
                "total_tokens": (data.get("prompt_eval_count", 0) + data.get("eval_count", 0)),
            },
            finish_reason=finish_reason,
        )

    async def chat_stream(
        self,
        messages: list[LLMMessage],
        temperature: float = 0.1,
        max_tokens: int = 4096,
    ):
        payload = {
            "model": self._model,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
            "stream": True,
        }

        last_exc: Exception | None = None
        for attempt in range(1 + self._max_retries):
            try:
                async with self._client.stream(
                    "POST",
                    f"{self._base_url}/api/chat",
                    json=payload,
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                chunk = json.loads(line)
                                content = chunk.get("message", {}).get("content", "")
                                if content:
                                    yield content
                            except json.JSONDecodeError:
                                continue
                    return
            except (httpx.TimeoutException, httpx.ConnectError, httpx.HTTPStatusError) as e:
                last_exc = e
                if attempt < self._max_retries:
                    wait = 1.0 * (2**attempt)
                    await asyncio.sleep(wait)
        if last_exc:
            raise last_exc

    async def close(self) -> None:
        await self._client.aclose()
