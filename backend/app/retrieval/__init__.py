from dataclasses import dataclass, field

from app.core.config import get_settings
from app.core.logging import get_logger
from app.embeddings import get_embedding_service
from app.embeddings.base import BaseEmbeddingService
from app.vectorstore import get_vector_store
from app.vectorstore.base import BaseVectorStore
from app.vectorstore.base import SearchResult as SearchResult

logger = get_logger("retrieval")


@dataclass
class RetrievalResult:
    id: str
    content: str
    score: float
    metadata: dict = field(default_factory=dict)


class ReRanker:
    def __init__(self, alpha: float = 0.3):
        self.alpha = alpha

    def rerank(
        self,
        query: str,
        results: list[RetrievalResult],
    ) -> list[RetrievalResult]:
        if not results:
            return results

        query_tokens = set(query.lower().split())
        query_len = len(query_tokens)

        for r in results:
            doc_tokens = set(r.content.lower().split())
            overlap = len(query_tokens & doc_tokens)
            bm25_rough = overlap / (query_len + 1) if query_len else 0
            blended = (1 - self.alpha) * r.score + self.alpha * bm25_rough
            r.score = round(blended, 4)

        results.sort(key=lambda x: x.score, reverse=True)
        return results


class SemanticSearch:
    def __init__(
        self,
        embedding_service: BaseEmbeddingService | None = None,
        vector_store: BaseVectorStore | None = None,
        re_ranker: ReRanker | None = None,
    ):
        self.embedding_service = embedding_service or get_embedding_service()
        self.vector_store = vector_store or get_vector_store()
        self.re_ranker = re_ranker or ReRanker()
        settings = get_settings()
        self.min_relevance_score = settings.MIN_RELEVANCE_SCORE

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

        retrieved = [
            RetrievalResult(
                id=r.id,
                content=r.content,
                score=r.score,
                metadata=r.metadata,
            )
            for r in results
        ]

        retrieved = self.re_ranker.rerank(query, retrieved)
        retrieved = [r for r in retrieved if r.score >= self.min_relevance_score]

        logger.info(
            "Search query='%s' -> %d results (top_score=%.4f, min_score=%.2f)",
            query[:50],
            len(retrieved),
            retrieved[0].score if retrieved else 0.0,
            self.min_relevance_score,
        )

        return retrieved
