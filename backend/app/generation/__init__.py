from dataclasses import dataclass, field

from app.context import BuiltContext, build_context_from_results
from app.citation import CitationResult, compute_confidence, extract_citations
from app.llm import BaseLLM, LLMMessage, get_llm
from app.prompt import build_system_prompt, build_user_prompt
from app.retrieval import SemanticSearch, RetrievalResult
from app.core.logging import get_logger

logger = get_logger("generation")


@dataclass
class GeneratedResponse:
    answer: str
    confidence_score: float
    sources_used: list[str]
    retrieved_documents: list[dict]
    model: str
    token_usage: dict = field(default_factory=dict)


class GenerationPipeline:
    def __init__(
        self,
        retrieval: SemanticSearch | None = None,
        llm: BaseLLM | None = None,
    ):
        self.retrieval = retrieval or SemanticSearch()
        self.llm = llm or get_llm()

    async def generate(
        self,
        query: str,
        top_k: int = 5,
        filter_metadata: dict | None = None,
        min_relevance_score: float = 0.0,
    ) -> GeneratedResponse:
        logger.info("Generation pipeline started: query='%s' top_k=%d", query[:50], top_k)

        retrieval_results = await self.retrieval.search(
            query=query,
            top_k=top_k,
            filter_metadata=filter_metadata,
        )

        results_as_dicts = [
            {
                "id": r.id,
                "content": r.content,
                "score": r.score,
                "metadata": r.metadata,
            }
            for r in retrieval_results
        ]

        built_context = build_context_from_results(
            results_as_dicts,
            min_score=min_relevance_score,
        )

        logger.info(
            "Context built: %d documents, has_relevant=%s",
            built_context.document_count,
            built_context.has_relevant_docs,
        )

        messages = [
            LLMMessage(role="system", content=build_system_prompt()),
            LLMMessage(
                role="user",
                content=build_user_prompt(query, built_context.context_block),
            ),
        ]

        llm_response = await self.llm.chat(messages=messages)

        citation_result = extract_citations(llm_response.content)

        scores = [r.score for r in retrieval_results]
        confidence = compute_confidence(
            scores=scores,
            has_citations=bool(citation_result.source_references),
            has_context=built_context.has_relevant_docs,
        )

        sources_used = citation_result.source_references
        if not sources_used:
            sources_used = [
                doc.file_path or doc.filename
                for doc in built_context.documents
                if doc.file_path or doc.filename
            ]

        doc_summaries = [
            {
                "id": doc.id,
                "file_path": doc.file_path,
                "filename": doc.filename,
                "score": doc.score,
                "document_type": doc.document_type,
                "language": doc.language,
                "chunk_index": doc.chunk_index,
            }
            for doc in built_context.documents
        ]

        logger.info(
            "Generation complete: confidence=%.2f sources=%d tokens=%s",
            confidence,
            len(sources_used),
            llm_response.usage.get("total_tokens", "?"),
        )

        return GeneratedResponse(
            answer=llm_response.content,
            confidence_score=confidence,
            sources_used=sources_used,
            retrieved_documents=doc_summaries,
            model=llm_response.model,
            token_usage=llm_response.usage,
        )
