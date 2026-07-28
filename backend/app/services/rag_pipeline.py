from __future__ import annotations

import re
from typing import Any


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def tokenize(text: str) -> list[str]:
    return re.findall(r"\w+", (text or "").lower())


def build_query_variants(question: str) -> list[str]:
    variants = []
    cleaned = normalize_text(question)
    if cleaned:
        variants.append(cleaned)

    tokens = [token for token in tokenize(cleaned) if len(token) > 2]
    if tokens:
        variants.append(" ".join(tokens[:8]))

    lowered = cleaned.lower()
    if any(
        keyword in lowered for keyword in ["deploy", "docker", "kubernetes", "service"]
    ):
        variants.append("deployment docker infrastructure")
    if any(keyword in lowered for keyword in ["api", "endpoint", "schema", "database"]):
        variants.append("api schema database")
    if any(keyword in lowered for keyword in ["git", "repository", "branch", "commit"]):
        variants.append("repository git workflow")

    seen: set[str] = set()
    unique: list[str] = []
    for variant in variants:
        if variant and variant.lower() not in seen:
            seen.add(variant.lower())
            unique.append(variant)
    return unique


def sanitize_question(question: str) -> str:
    cleaned = normalize_text(question)
    if not cleaned:
        return ""
    blocked = ["ignore previous instructions", "system prompt", "act as", "you are"]
    lowered = cleaned.lower()
    if any(pattern in lowered for pattern in blocked):
        cleaned = re.sub(
            r"(?i)(ignore previous instructions|system prompt|act as|you are)\s*",
            "",
            cleaned,
        )
    return normalize_text(cleaned)


def detect_prompt_injection(question: str) -> bool:
    lowered = (question or "").lower()
    suspicious = [
        "ignore previous",
        "system prompt",
        "developer message",
        "bypass",
        "reveal secret",
    ]
    return any(marker in lowered for marker in suspicious)


def build_context_payload(
    docs: list[dict[str, Any]], max_context_chars: int = 4000
) -> str:
    if not docs:
        return ""

    chunks: list[str] = []
    total = 0
    for index, doc in enumerate(docs, start=1):
        text = str(doc.get("text", "") or "").strip()
        if not text:
            continue
        metadata = doc.get("metadata") or {}
        source = (
            metadata.get("source")
            or metadata.get("path")
            or metadata.get("type")
            or "corpus"
        )
        snippet = text
        if len(snippet) + total > max_context_chars:
            snippet = snippet[: max(0, max_context_chars - total - 80)] + "..."
        chunks.append(f"[{index}] Source: {source}\n{snippet}")
        total += len(snippet)
        if total >= max_context_chars:
            break
    return "\n\n".join(chunks)


def compress_context(text: str, max_chars: int = 2000) -> str:
    if not text:
        return ""
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 3].rstrip() + "..."
