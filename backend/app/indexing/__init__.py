from app.ingestion import IngestionPipeline
from app.retrieval import SemanticSearch
from app.core.logging import get_logger

logger = get_logger("indexing")


class IndexingOrchestrator:
    def __init__(self, pipeline: IngestionPipeline | None = None):
        self.pipeline = pipeline or IngestionPipeline()

    async def index_repository(
        self,
        repo_path: str,
        repository_name: str,
        extensions: list[str] | None = None,
    ) -> dict:
        logger.info("Starting indexing for repository: %s", repo_path)

        results = await self.pipeline.ingest_directory(
            directory=repo_path,
            repository=repository_name,
            project=repository_name,
            extensions=extensions,
        )

        total_chunks = sum(r.get("chunks", 0) for r in results)
        logger.info(
            "Indexing complete: %s -> %d files, %d chunks",
            repository_name,
            len(results),
            total_chunks,
        )

        return {
            "repository": repository_name,
            "files_indexed": len(results),
            "total_chunks": total_chunks,
            "details": results,
        }

    async def index_single_file(
        self,
        file_path: str,
        repository_name: str = "",
    ) -> dict:
        return await self.pipeline.ingest_file(
            file_path=file_path,
            repository=repository_name,
            project=repository_name,
        )

    async def reindex_repository(
        self,
        repo_path: str,
        repository_name: str,
        extensions: list[str] | None = None,
    ) -> dict:
        from app.metadata import MetadataStore

        meta_store = self.pipeline.metadata_store
        existing = meta_store.list_all(repository=repository_name)
        for doc in existing:
            await self.pipeline._delete_old_chunks(doc)

        return await self.index_repository(
            repo_path=repo_path,
            repository_name=repository_name,
            extensions=extensions,
        )

    def get_status(self) -> dict:
        meta_store = self.pipeline.metadata_store
        return {
            **meta_store.stats(),
            "vector_store_count": 0,
        }
