from __future__ import annotations
import asyncio
import json
import os
from typing import AsyncGenerator

import httpx

try:
    from transformers import pipeline
except Exception:
    pipeline = None


DEFAULT_OLLAMA_BASE = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2")
DEFAULT_LOCAL_MODEL = os.environ.get("LOCAL_MODEL", "gpt2")
DEFAULT_LLM_PROVIDER = (os.environ.get("LLM_PROVIDER") or "ollama").lower()


class LLMProvider:
    async def generate(self, prompt: str) -> str:
        raise NotImplementedError()

    async def stream(self, prompt: str) -> AsyncGenerator[str, None]:
        raise NotImplementedError()


class OllamaProvider(LLMProvider):
    def __init__(
        self,
        base_url: str | None = None,
        model: str | None = None,
        num_predict: int | None = None,
    ):
        self.base_url = (base_url or DEFAULT_OLLAMA_BASE).rstrip("/")
        self.model = model or DEFAULT_OLLAMA_MODEL
        self.options = {
            "num_predict": int(os.environ.get("OLLAMA_NUM_PREDICT", num_predict or 700))
        }

    async def generate(self, prompt: str) -> str:
        async with httpx.AsyncClient(timeout=180.0) as client:
            resp = await client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": self.options,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, dict):
                if "response" in data:
                    return data["response"]
                if "results" in data:
                    return "".join(
                        [
                            r.get("output", "") or r.get("response", "")
                            for r in data.get("results", [])
                        ]
                    )
                if "output" in data:
                    return data["output"]
            return json.dumps(data)

    async def stream(self, prompt: str) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": True,
                    "options": self.options,
                },
            ) as resp:
                resp.raise_for_status()
                async for chunk in resp.aiter_text():
                    if not chunk:
                        continue
                    for line in chunk.split("\n"):
                        if not line:
                            continue
                        clean = line
                        if clean.startswith("data:"):
                            clean = clean[len("data:") :]
                            if clean.startswith(" "):
                                clean = clean[1:]
                        if not clean:
                            continue
                        try:
                            data = json.loads(clean)
                        except json.JSONDecodeError:
                            continue
                        if not isinstance(data, dict):
                            continue
                        if data.get("done"):
                            continue
                        response = data.get("response")
                        if response and response != "":
                            yield response


class LocalProvider(LLMProvider):
    def __init__(self, model: str | None = None, max_new_tokens: int | None = None):
        self.model = model or DEFAULT_LOCAL_MODEL
        self.max_new_tokens = int(
            os.environ.get("LOCAL_MODEL_MAX_TOKENS", max_new_tokens or 256)
        )
        self._pipeline = None

    def _ensure_pipeline(self) -> None:
        if self._pipeline is not None:
            return
        if pipeline is None:
            raise RuntimeError(
                "Local model provider requires the transformers package."
            )
        device = (
            0
            if os.environ.get("USE_CUDA", "false").lower() in ("1", "true", "yes")
            else -1
        )
        self._pipeline = pipeline(
            "text-generation",
            model=self.model,
            device=device,
            return_full_text=False,
        )

    async def generate(self, prompt: str) -> str:
        self._ensure_pipeline()
        outputs = await asyncio.to_thread(
            self._pipeline,
            prompt,
            max_new_tokens=self.max_new_tokens,
            do_sample=True,
            top_p=float(os.environ.get("LOCAL_MODEL_TOP_P", "0.92")),
            temperature=float(os.environ.get("LOCAL_MODEL_TEMPERATURE", "0.8")),
        )
        if not outputs:
            return ""
        if isinstance(outputs, list):
            return outputs[0].get("generated_text") or outputs[0].get("text") or ""
        return str(outputs)

    async def stream(self, prompt: str) -> AsyncGenerator[str, None]:
        text = await self.generate(prompt)
        if text:
            yield text


def get_fallback_provider(primary: LLMProvider) -> LLMProvider:
    if isinstance(primary, OllamaProvider):
        return LocalProvider(model=os.environ.get("LOCAL_MODEL"))
    return OllamaProvider(model=os.environ.get("OLLAMA_MODEL"))


def get_default_provider() -> LLMProvider:
    provider_name = (os.environ.get("LLM_PROVIDER") or DEFAULT_LLM_PROVIDER).lower()
    if provider_name == "local":
        return LocalProvider(model=os.environ.get("LOCAL_MODEL"))
    if provider_name == "auto" and pipeline is not None:
        return LocalProvider(model=os.environ.get("LOCAL_MODEL"))
    return OllamaProvider(model=os.environ.get("OLLAMA_MODEL"))


def build_provider_for_question(question: str) -> LLMProvider:
    provider_name = (os.environ.get("LLM_PROVIDER") or DEFAULT_LLM_PROVIDER).lower()
    if provider_name == "local":
        return LocalProvider(model=os.environ.get("LOCAL_MODEL"))
    if provider_name == "auto" and pipeline is not None:
        return LocalProvider(model=os.environ.get("LOCAL_MODEL"))
    return OllamaProvider(model=os.environ.get("OLLAMA_MODEL", DEFAULT_OLLAMA_MODEL))
