from __future__ import annotations
import os
import asyncio
from typing import Iterable, List

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None

from app.services.corpus_client import CorpusClient
from app.services.pg_vector_store import PGVectorStore


class EmbeddingWorker:
    def __init__(self, model_name: str | None = None, corpus_base: str | None = None):
        self.model_name = model_name or os.environ.get('EMBEDDING_MODEL', 'all-MiniLM-L6-v2')
        self.model = SentenceTransformer(self.model_name) if SentenceTransformer else None
        self.client = CorpusClient(corpus_base)
        self.pg = None
        if os.environ.get('DATABASE_URL'):
            self.pg = PGVectorStore(os.environ.get('DATABASE_URL'))

    async def fetch_documents(self) -> List[dict]:
        try:
            records = await self.client.get('/api/v1/records')
            return records or []
        except Exception:
            return []

    def embed_texts(self, texts: Iterable[str]) -> List[List[float]]:
        if self.model:
            emb = self.model.encode(list(texts), show_progress_bar=False)
            return [e.tolist() if hasattr(e, 'tolist') else list(e) for e in emb]
        # fallback: simple token-count vector (not suitable for production)
        return [[float(len(t))] for t in texts]

    async def run_once(self):
        docs = await self.fetch_documents()
        texts = [ (str(d.get('id') or d.get('slug') or i), (d.get('title','') + '\n' + d.get('description','') + '\n' + d.get('content',''))) for i, d in enumerate(docs) ]
        ids = [t[0] for t in texts]
        bodies = [t[1] for t in texts]
        embeddings = self.embed_texts(bodies)
        if self.pg:
            for doc_id, body, emb, d in zip(ids, bodies, embeddings, docs):
                self.pg.upsert(doc_id, body, emb, source=d.get('source'))

    async def run(self, interval_seconds: int = 300):
        while True:
            await self.run_once()
            await asyncio.sleep(interval_seconds)
