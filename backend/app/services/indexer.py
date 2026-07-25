import os
import asyncio
from typing import Any

from app.services.corpus_client import CorpusClient
from app.services.vector_store import vector_store
import os
from app.services.embedding_worker import EmbeddingWorker



class CorpusIndexer:
    def __init__(self, base_url: str | None = None):
        self.client = CorpusClient(base_url)
        self._running = False

    async def scan_once(self) -> list[dict[str, Any]]:
        # Minimal: fetch records list and return
        try:
            records = await self.client.get('/api/v1/records')
            # if DATABASE_URL is configured, delegate to embedding worker to compute and upsert embeddings into PG vector store
            if os.environ.get('DATABASE_URL'):
                worker = EmbeddingWorker()
                await worker.run_once()
            else:
                # upsert into in-memory vector store
                for r in (records or []):
                    doc_id = str(r.get("id") or r.get("record_id") or r.get("_id") or r.get("slug") or "")
                    text = (r.get("title", "") + "\n" + r.get("description", "") + "\n" + r.get("content", ""))
                    await vector_store.upsert(doc_id or text[:64], text, metadata={"source": r.get("source", "corpus")})
            return records or []
        except Exception:
            return []

    async def run(self, interval_seconds: int = 60):
        self._running = True
        while self._running:
            try:
                await self.scan_once()
            except Exception:
                pass
            await asyncio.sleep(interval_seconds)

    def stop(self):
        self._running = False


indexer = CorpusIndexer()
