from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

from app.core.config import get_settings
from app.core.logging import get_logger
from app.vectorstore.base import BaseVectorStore, SearchResult, VectorRecord

if TYPE_CHECKING:
    import chromadb

logger = get_logger("vectorstore.chroma")


class ChromaVectorStore(BaseVectorStore):
    def __init__(self, persist_directory: str | None = None):
        settings = get_settings()
        self._persist_dir = Path(
            persist_directory or settings.VECTOR_STORE_PATH
            if hasattr(settings, "VECTOR_STORE_PATH")
            else "./chroma_db"
        )
        self._persist_dir.mkdir(parents=True, exist_ok=True)
        self._collection_name = "corpusguard"
        self._client: chromadb.PersistentClient | None = None
        self._collection: chromadb.Collection | None = None
        self._initialized = False

    async def _ensure_init(self):
        if self._initialized:
            return
        import chromadb

        self._client = chromadb.PersistentClient(path=str(self._persist_dir))
        self._collection = self._client.get_or_create_collection(
            name=self._collection_name,
            metadata={"hnsw:space": "cosine"},
        )
        self._initialized = True
        count = self._collection.count()
        logger.info("ChromaDB initialized: path=%s documents=%d", self._persist_dir, count)

    async def insert(self, records: list[VectorRecord]) -> int:
        await self._ensure_init()
        ids = [r.id for r in records]
        embeddings = [r.embedding for r in records]
        metadatas = [r.metadata for r in records]
        documents = [r.content for r in records]

        self._collection.add(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=documents,
        )
        logger.info("ChromaDB insert: %d records", len(records))
        return len(records)

    async def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        filter_metadata: dict | None = None,
    ) -> list[SearchResult]:
        await self._ensure_init()
        where = filter_metadata or None

        results = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where,
        )

        if not results["ids"]:
            return []

        ids = results["ids"][0]
        distances = results["distances"][0] if "distances" in results else [0.0] * len(ids)
        metadatas = results["metadatas"][0] if "metadatas" in results else [{}] * len(ids)
        documents = results["documents"][0] if "documents" in results else [""] * len(ids)

        output: list[SearchResult] = []
        for i, doc_id in enumerate(ids):
            score = 1.0 - distances[i]
            output.append(
                SearchResult(
                    id=doc_id,
                    content=documents[i],
                    score=max(0.0, score),
                    metadata=metadatas[i],
                )
            )
        return output

    async def delete(self, ids: list[str]) -> int:
        await self._ensure_init()
        existing = self._collection.get(ids=ids)
        if existing and existing["ids"]:
            self._collection.delete(ids=existing["ids"])
        return len(existing["ids"]) if existing else 0

    async def delete_by_filter(self, filter_metadata: dict) -> int:
        await self._ensure_init()
        existing = self._collection.get(where=filter_metadata)
        if existing and existing["ids"]:
            self._collection.delete(ids=existing["ids"])
        return len(existing["ids"]) if existing else 0

    async def count(self) -> int:
        await self._ensure_init()
        return self._collection.count()
