from __future__ import annotations
import os
import json
from typing import AsyncGenerator

import httpx


class LLMProvider:
    async def generate(self, prompt: str) -> str:
        raise NotImplementedError()

    async def stream(self, prompt: str) -> AsyncGenerator[str, None]:
        raise NotImplementedError()


class OllamaProvider(LLMProvider):
    def __init__(self, base_url: str | None = None, model: str | None = None):
        self.base_url = (base_url or os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")).rstrip("/")
        self.model = model or os.environ.get("OLLAMA_MODEL", "llama3.2")

    async def generate(self, prompt: str) -> str:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{self.base_url}/api/generate",
                json={"model": self.model, "prompt": prompt, "stream": False, "max_tokens": 512},
            )
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, dict):
                if "response" in data:
                    return data["response"]
                if "results" in data:
                    text = "".join([r.get("output", "") or r.get("response", "") for r in data.get("results", [])])
                    return text
                if "output" in data:
                    return data["output"]
            return json.dumps(data)

    async def stream(self, prompt: str) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/generate",
                json={"model": self.model, "prompt": prompt, "stream": True, "max_tokens": 512},
            ) as resp:
                resp.raise_for_status()
                async for chunk in resp.aiter_text():
                    if not chunk:
                        continue
                    for line in chunk.split("\n"):
                        if not line:
                            continue
                        clean = line.strip()
                        if clean.startswith("data:"):
                            clean = clean[len("data:"):].strip()
                        yield clean


def get_default_provider() -> LLMProvider:
    # Provider selection via environment variable LLM_PROVIDER
    provider = (os.environ.get("LLM_PROVIDER") or "ollama").lower()
    if provider == "ollama":
        return OllamaProvider()
    # stubs for other providers can be added later
    return OllamaProvider()
