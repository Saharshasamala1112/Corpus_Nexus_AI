from __future__ import annotations
import os
from typing import List

from app.services.vector_store import vector_store
from app.services.embedding_worker import EmbeddingWorker


def _collect_files(base_path: str, exts: List[str]) -> List[str]:
    out = []
    for root, dirs, files in os.walk(base_path):
        # skip node_modules and .git
        if 'node_modules' in root or '.git' in root:
            continue
        for f in files:
            if any(f.lower().endswith(e) for e in exts):
                out.append(os.path.join(root, f))
    return out


def _chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200):
    i = 0
    chunks = []
    n = len(text)
    while i < n:
        chunk = text[i:i+chunk_size]
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks


async def ingest_local(base_path: str | None = None) -> int:
    """Scan local files under base_path and upsert into the active vector store.

    Returns the number of chunks indexed.
    """
    base = base_path or os.environ.get('LOCAL_DOCS_PATH') or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    exts = ['.md', '.mdx', '.txt', '.rst', '.py', '.js', '.ts', '.json']
    files = _collect_files(base, exts)
    if not files:
        return 0

    # If PG is configured, use EmbeddingWorker to compute embeddings and upsert
    if os.environ.get('DATABASE_URL'):
        worker = EmbeddingWorker()
        all_chunks = []
        ids = []
        metas = []
        for fp in files:
            try:
                with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                    txt = f.read()
            except Exception:
                continue
            rel = os.path.relpath(fp, base)
            chunks = _chunk_text(txt)
            for idx, c in enumerate(chunks):
                doc_id = f"local:{rel}#{idx}"
                all_chunks.append(c)
                ids.append(doc_id)
                metas.append({'path': rel})

        if all_chunks:
            embs = worker.embed_texts(all_chunks)
            if worker.pg:
                for doc_id, text, emb, meta in zip(ids, all_chunks, embs, metas):
                    worker.pg.upsert(doc_id, text, emb, source=meta.get('path'))
            return len(all_chunks)

    # Fallback: upsert into in-memory vector store without embeddings
    count = 0
    for fp in files:
        try:
            with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                txt = f.read()
        except Exception:
            continue
        rel = os.path.relpath(fp, base)
        chunks = _chunk_text(txt)
        for idx, c in enumerate(chunks):
            doc_id = f"local:{rel}#{idx}"
            await vector_store.upsert(doc_id, c, metadata={'path': rel})
            count += 1
    return count
