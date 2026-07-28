from __future__ import annotations

import asyncio
import hashlib
import os
import re
from typing import Any

from app.services.corpus_client import CorpusClient
from app.services.vector_store import search_docs


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
    if any(keyword in lowered for keyword in ["deploy", "docker", "kubernetes", "service"]):
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
        cleaned = re.sub(r"(?i)(ignore previous instructions|system prompt|act as|you are)\s*", "", cleaned)
    return normalize_text(cleaned)


def detect_prompt_injection(question: str) -> bool:
    lowered = (question or "").lower()
    suspicious = ["ignore previous", "system prompt", "developer message", "bypass", "reveal secret"]
    return any(marker in lowered for marker in suspicious)


def build_context_payload(docs: list[dict[str, Any]], max_context_chars: int = 4000) -> str:
    if not docs:
        return ""

    chunks: list[str] = []
    total = 0
    for index, doc in enumerate(docs, start=1):
        text = str(doc.get("text", "") or "").strip()
        if not text:
            continue
        metadata = doc.get("metadata") or {}
        source = metadata.get("source") or metadata.get("path") or metadata.get("type") or "corpus"
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


def _content_hash(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def _rank_docs(docs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    scored: list[tuple[float, dict[str, Any]]] = []
    for d in docs:
        text = str(d.get("text", "") or "")
        score = d.get("score", 0.0) or 0.0
        if not score:
            metadata = d.get("metadata") or {}
            source = metadata.get("source") or metadata.get("path") or ""
            boost = 0.15 if "repo" in metadata else 0.05
            score = boost + (min(len(text), 2000) / 2000) * 0.1
        scored.append((score, d))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [d for _, d in scored]


async def retrieve_context(query: str, top_k: int = 5) -> list[dict[str, Any]]:
    seen_hashes: set[str] = set()
    combined: list[dict[str, Any]] = []

    vector_docs = await search_docs(query, top_k=top_k)
    for d in vector_docs:
        h = _content_hash(str(d.get("text", "")))
        if h not in seen_hashes:
            seen_hashes.add(h)
            combined.append(d)

    try:
        client = CorpusClient()
        records = await client.get("/api/v1/records", token=os.environ.get("CORPUS_API_TOKEN"))
        if isinstance(records, list):
            for rec in records:
                title = str(rec.get("title", "") or "")
                desc = str(rec.get("description", "") or "")
                content = str(rec.get("content", "") or "")
                text = f"{title}\n{desc}\n{content}".strip()
                if not text:
                    continue
                q = query.lower()
                if q in text.lower():
                    h = _content_hash(text)
                    if h not in seen_hashes:
                        seen_hashes.add(h)
                        combined.append({
                            "id": f"corpus:{rec.get('uid', '')}",
                            "text": text[:1500],
                            "metadata": {"source": f"corpus:{rec.get('uid', '')}", "type": "corpus"},
                            "score": 0.5,
                        })
    except Exception:
        pass

    ranked = _rank_docs(combined)
    total_chars = 0
    result: list[dict[str, Any]] = []
    for d in ranked:
        text_len = len(str(d.get("text", "")))
        if total_chars + text_len > 4000:
            break
        result.append(d)
        total_chars += text_len
        if len(result) >= top_k:
            break

    return result
