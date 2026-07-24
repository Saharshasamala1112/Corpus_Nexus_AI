from __future__ import annotations
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
import numpy as np

DATABASE_URL = os.environ.get('DATABASE_URL')


class PGVectorStore:
    def __init__(self, database_url: str | None = None):
        self.database_url = database_url or DATABASE_URL
        if not self.database_url:
            raise RuntimeError('DATABASE_URL not configured')
        self.engine = create_engine(self.database_url)
        self.Session = sessionmaker(bind=self.engine)

    def upsert(self, doc_id: str, text_content: str, embedding: list[float], source: str | None = None):
        # upsert into documents table
        vec = list(embedding)
        with self.engine.begin() as conn:
            conn.execute(text("""
            INSERT INTO documents (id, title, content, source, embedding)
            VALUES (:id, :title, :content, :source, :embedding)
            ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding, source = EXCLUDED.source
            """), {"id": doc_id, "title": doc_id, "content": text_content, "source": source or 'corpus', "embedding": vec})

    def search(self, query_embedding: list[float], top_k: int = 5):
        # cosine similarity using pgvector operator <=> for distance; smaller is better
        if not query_embedding:
            return []
        with self.engine.connect() as conn:
            res = conn.execute(text("SELECT id, content, source, 1 - (embedding <#> :vec) as score FROM documents ORDER BY embedding <#> :vec LIMIT :k"), {"vec": list(query_embedding), "k": top_k})
            rows = [dict(r) for r in res]
            return rows
