from __future__ import annotations
import os
import json
from typing import AsyncGenerator

import httpx


MODEL_ROUTING_KEYWORDS = {
    "qwen2.5": ["deploy", "docker", "api", "database", "schema", "architecture", "service", "infrastructure"],
    "llama3.2": ["explain", "summarize", "general", "overview", "project"],
    "mistral": ["code", "debug", "python", "typescript", "error"],
    "deepseek-r1": ["reason", "analyze", "design", "architecture", "algorithm"],
}


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
        async with httpx.AsyncClient(timeout=180.0) as client:
            resp = await client.post(
                f"{self.base_url}/api/generate",
                json={"model": self.model, "prompt": prompt, "stream": False, "options": {"num_predict": 700}},
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
                json={"model": self.model, "prompt": prompt, "stream": True, "options": {"num_predict": 700}},
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
                        if clean:
                            yield clean


def select_model_for_question(question: str, configured: str | None = None) -> str:
    text = (question or "").lower()
    if configured:
        return configured
    for model, keywords in MODEL_ROUTING_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return model
    return os.environ.get("OLLAMA_MODEL", "llama3.2")


def get_default_provider() -> LLMProvider:
    provider = (os.environ.get("LLM_PROVIDER") or "ollama").lower()
    if provider == "ollama":
        configured_model = os.environ.get("OLLAMA_MODEL", "llama3.2")
        selected_model = select_model_for_question("", configured_model)
        return OllamaProvider(model=selected_model)
    return OllamaProvider()


def build_provider_for_question(question: str) -> LLMProvider:
    selected = select_model_for_question(question)
    return OllamaProvider(model=selected)

