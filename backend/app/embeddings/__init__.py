from app.embeddings.base import BaseEmbeddingService
from app.embeddings.mock_embeddings import MockEmbeddingService


def get_embedding_service() -> BaseEmbeddingService:
    try:
        from sentence_transformers import SentenceTransformer  # noqa: F401

        from app.embeddings.sentence_transformer_embeddings import (
            SentenceTransformerEmbeddingService,
        )

        return SentenceTransformerEmbeddingService()
    except ImportError:
        return MockEmbeddingService()
