import hashlib
import random

from app.embeddings.base import BaseEmbeddingService


class MockEmbeddingService(BaseEmbeddingService):
    def __init__(self, dim: int = 384):
        self._dim = dim
        self._cache: dict[str, list[float]] = {}

    @property
    def dimension(self) -> int:
        return self._dim

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        return [self._mock_embed(t) for t in texts]

    async def embed_query(self, text: str) -> list[float]:
        return self._mock_embed(text)

    def _mock_embed(self, text: str) -> list[float]:
        h = hashlib.sha256(text.encode()).hexdigest()
        seed = int(h[:8], 16)
        rng = random.Random(seed)
        vec = [rng.gauss(0, 1) for _ in range(self._dim)]
        norm = sum(x * x for x in vec) ** 0.5
        return [x / norm for x in vec] if norm > 0 else vec
