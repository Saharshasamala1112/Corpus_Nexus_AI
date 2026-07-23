import math

from app.vectorstore.base import BaseVectorStore, SearchResult, VectorRecord


class InMemoryVectorStore(BaseVectorStore):
    def __init__(self):
        self._records: dict[str, VectorRecord] = {}

    async def insert(self, records: list[VectorRecord]) -> int:
        for record in records:
            self._records[record.id] = record
        return len(records)

    async def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        filter_metadata: dict | None = None,
    ) -> list[SearchResult]:
        candidates = list(self._records.values())

        if filter_metadata:
            candidates = [
                r
                for r in candidates
                if all(r.metadata.get(k) == v for k, v in filter_metadata.items())
            ]

        scored: list[tuple[float, VectorRecord]] = []
        for record in candidates:
            score = self._cosine_similarity(query_embedding, record.embedding)
            scored.append((score, record))

        scored.sort(key=lambda x: x[0], reverse=True)

        return [
            SearchResult(
                id=record.id,
                content=record.content,
                score=score,
                metadata=record.metadata,
            )
            for score, record in scored[:top_k]
        ]

    async def delete(self, ids: list[str]) -> int:
        count = 0
        for doc_id in ids:
            if doc_id in self._records:
                del self._records[doc_id]
                count += 1
        return count

    async def delete_by_filter(self, filter_metadata: dict) -> int:
        to_delete = [
            r.id
            for r in self._records.values()
            if all(r.metadata.get(k) == v for k, v in filter_metadata.items())
        ]
        for doc_id in to_delete:
            del self._records[doc_id]
        return len(to_delete)

    async def count(self) -> int:
        return len(self._records)

    @staticmethod
    def _cosine_similarity(a: list[float], b: list[float]) -> float:
        if len(a) != len(b):
            return 0.0
        dot = sum(x * y for x, y in zip(a, b, strict=False))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(x * x for x in b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)
