from fastapi import APIRouter, HTTPException

from app.schemas.knowledge import (
    IndexRequest,
    IndexResponse,
    SearchRequest,
    SearchResponse,
    SearchResultItem,
    KnowledgeStatusResponse,
    ReindexResponse,
)
from app.indexing import IndexingOrchestrator
from app.retrieval import SemanticSearch
from app.core.logging import get_logger

logger = get_logger("knowledge.api")

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

_orchestrator: IndexingOrchestrator | None = None
_search: SemanticSearch | None = None


def _get_orchestrator() -> IndexingOrchestrator:
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = IndexingOrchestrator()
    return _orchestrator


def _get_search() -> SemanticSearch:
    global _search
    if _search is None:
        _search = SemanticSearch()
    return _search


@router.post("/index", response_model=IndexResponse, summary="Index a repository")
async def index_repository(request: IndexRequest) -> IndexResponse:
    orchestrator = _get_orchestrator()
    try:
        result = await orchestrator.index_repository(
            repo_path=request.repository_path,
            repository_name=request.repository_name,
            extensions=request.extensions,
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Path not found: {request.repository_path}")
    except Exception as e:
        logger.exception("Indexing failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

    return IndexResponse(
        repository=result["repository"],
        files_indexed=result["files_indexed"],
        total_chunks=result["total_chunks"],
    )


@router.post("/search", response_model=SearchResponse, summary="Semantic search")
async def search_knowledge(request: SearchRequest) -> SearchResponse:
    search = _get_search()

    filter_metadata = None
    if request.repository:
        filter_metadata = {"repository": request.repository}

    try:
        results = await search.search(
            query=request.query,
            top_k=request.top_k,
            filter_metadata=filter_metadata,
        )
    except Exception as e:
        logger.exception("Search failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

    return SearchResponse(
        query=request.query,
        results=[
            SearchResultItem(
                id=r.id,
                content=r.content,
                score=r.score,
                metadata=r.metadata,
            )
            for r in results
        ],
        total=len(results),
    )


@router.get("/status", response_model=KnowledgeStatusResponse, summary="Knowledge base status")
async def get_status() -> KnowledgeStatusResponse:
    orchestrator = _get_orchestrator()
    status = orchestrator.get_status()
    return KnowledgeStatusResponse(
        total_documents=status["total_documents"],
        total_chunks=status["total_chunks"],
        by_type=status["by_type"],
        by_language=status["by_language"],
    )


@router.post("/reindex", response_model=ReindexResponse, summary="Reindex a repository")
async def reindex_repository(request: IndexRequest) -> ReindexResponse:
    orchestrator = _get_orchestrator()
    try:
        result = await orchestrator.reindex_repository(
            repo_path=request.repository_path,
            repository_name=request.repository_name,
            extensions=request.extensions,
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Path not found: {request.repository_path}")
    except Exception as e:
        logger.exception("Reindexing failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

    return ReindexResponse(
        repository=result["repository"],
        files_indexed=result["files_indexed"],
        total_chunks=result["total_chunks"],
        message="Reindexing complete",
    )
