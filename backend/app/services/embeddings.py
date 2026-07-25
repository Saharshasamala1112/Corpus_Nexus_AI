from __future__ import annotations
import os
import re
from typing import Sequence, List

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None

_MODEL = None


def _normalize_text(text: str) -> str:
    return " ".join(re.findall(r"\w+", text.lower()))


def get_embedding_model():
    global _MODEL
    if _MODEL is None and SentenceTransformer:
        model_name = os.environ.get("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
        _MODEL = SentenceTransformer(model_name)
    return _MODEL


def embed_texts(texts: Sequence[str]) -> List[List[float]]:
    model = get_embedding_model()
    if model:
        embeddings = model.encode(list(texts), show_progress_bar=False, convert_to_numpy=True)
        return [emb.tolist() if hasattr(emb, "tolist") else list(emb) for emb in embeddings]

    return [[float(len(_normalize_text(text).split()))] for text in texts]
