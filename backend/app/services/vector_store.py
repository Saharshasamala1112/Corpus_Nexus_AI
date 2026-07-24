from __future__ import annotations
import asyncio
import math
import os
import re
from typing import Any, List

from app.services.embeddings import embed_texts


def _tokenize(text: str) -> list[str]:
    return re.findall(r"\w+", text.lower())


def _bm25_score(query: str, text: str) -> float:
    query_terms = _tokenize(query)
    if not query_terms:
        return 0.0

    doc_terms = _tokenize(text)
    if not doc_terms:
        return 0.0

    term_freq: dict[str, int] = {}
    for token in doc_terms:
        term_freq[token] = term_freq.get(token, 0) + 1

    score = 0.0
    for token in set(query_terms):
        if token in term_freq:
            score += math.log(1 + term_freq[token])

    return score / math.sqrt(len(doc_terms) + 1)


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0

    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


async def _embed_text(text: str) -> list[float]:
    embeddings = await asyncio.to_thread(embed_texts, [text])
    return embeddings[0] if embeddings else []


class InMemoryVectorStore:
    def __init__(self):
        self._docs: List[dict[str, Any]] = []

    async def upsert(self, doc_id: str, text: str, metadata: dict | None = None):
        embedding = await _embed_text(text)
        record = {"id": doc_id, "text": text, "metadata": metadata or {}, "embedding": embedding}
        for idx, d in enumerate(self._docs):
            if d["id"] == doc_id:
                self._docs[idx] = record
                return
        self._docs.append(record)

    async def delete(self, doc_id: str):
        self._docs = [d for d in self._docs if d["id"] != doc_id]

    async def search(self, query: str, top_k: int = 5) -> List[dict[str, Any]]:
        if not self._docs:
            return []

        query_embedding = await _embed_text(query)
        has_dense = any(d.get("embedding") and len(d["embedding"]) > 1 for d in self._docs)

        results: list[tuple[float, dict[str, Any]]] = []
        for d in self._docs:
            bm25 = _bm25_score(query, d["text"])
            similarity = 0.0
            if has_dense and d.get("embedding"):
                similarity = _cosine_similarity(query_embedding, d["embedding"])

            if has_dense:
                score = similarity * 0.65 + bm25 * 0.35
            else:
                score = bm25

            results.append((score, {**d, "score": round(score, 4)}))

        results.sort(key=lambda item: item[0], reverse=True)
        return [doc for score, doc in results[:top_k]]


vector_store = InMemoryVectorStore()

# If DATABASE_URL is configured, prefer PGVectorStore
try:
    if os.environ.get('DATABASE_URL'):
        from app.services.pg_vector_store import PGVectorStore

        vector_store = PGVectorStore(os.environ.get('DATABASE_URL'))
except Exception:
    # fall back to in-memory
    pass


async def search_docs(query: str, top_k: int = 5) -> List[dict[str, Any]]:
    if isinstance(vector_store, InMemoryVectorStore):
        return await vector_store.search(query, top_k)

    try:
        emb = await asyncio.to_thread(embed_texts, [query])
    except Exception:
        return []

    if not emb:
        return []

    query_vec = emb[0]
    rows = vector_store.search(query_vec, top_k)
    out: List[dict[str, Any]] = []
    for r in rows:
        out.append({
            "id": r.get("id"),
            "text": r.get("content") or r.get("text") or "",
            "metadata": {"source": r.get("source") or r.get("metadata") or None, "score": r.get("score")},
        })
    return out
