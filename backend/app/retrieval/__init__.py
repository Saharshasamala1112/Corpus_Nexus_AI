from dataclasses import dataclass, field

from app.embeddings import get_embedding_service
from app.embeddings.base import BaseEmbeddingService
from app.vectorstore import get_vector_store
from app.vectorstore.base import BaseVectorStore, SearchResult
from app.core.logging import get_logger

logger = get_logger("retrieval")


@dataclass
class RetrievalResult:
    id: str
    content: str
    score: float
    metadata: dict = field(default_factory=dict)


class SemanticSearch:
    def __init__(
        self,
        embedding_service: BaseEmbeddingService | None = None,
        vector_store: BaseVectorStore | None = None,
    ):
        self.embedding_service = embedding_service or get_embedding_service()
        self.vector_store = vector_store or get_vector_store()

    async def search(
        self,
        query: str,
        top_k: int = 5,
        filter_metadata: dict | None = None,
    ) -> list[RetrievalResult]:
        query_embedding = await self.embedding_service.embed_query(query)

        results = await self.vector_store.search(
            query_embedding=query_embedding,
            top_k=top_k,
            filter_metadata=filter_metadata,
        )

        logger.info(
            "Search query='%s' -> %d results (top_score=%.4f)",
            query[:50],
            len(results),
            results[0].score if results else 0.0,
        )

        return [
            RetrievalResult(
                id=r.id,
                content=r.content,
                score=r.score,
                metadata=r.metadata,
            )
            for r in results
        ]
