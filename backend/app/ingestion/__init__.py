import uuid
from pathlib import Path

from app.chunking import Chunk as Chunk
from app.chunking import TextChunker
from app.core.logging import get_logger
from app.embeddings import get_embedding_service
from app.embeddings.base import BaseEmbeddingService
from app.metadata import DocumentMetadata, MetadataStore
from app.parsers import get_parser
from app.parsers.base import ParsedDocument as ParsedDocument
from app.vectorstore import get_vector_store
from app.vectorstore.base import BaseVectorStore, VectorRecord

logger = get_logger("ingestion")


class IngestionPipeline:
    def __init__(
        self,
        embedding_service: BaseEmbeddingService | None = None,
        vector_store: BaseVectorStore | None = None,
        metadata_store: MetadataStore | None = None,
        chunk_size: int = 800,
        chunk_overlap: int = 150,
    ):
        self.embedding_service = embedding_service or get_embedding_service()
        self.vector_store = vector_store or get_vector_store()
        self.metadata_store = metadata_store or MetadataStore()
        self.chunker = TextChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    async def ingest_file(
        self,
        file_path: str,
        repository: str = "",
        project: str = "",
    ) -> dict:
        path = Path(file_path)
        doc_id = str(uuid.uuid4())

        existing = self.metadata_store.get_by_path(str(path))
        if existing:
            doc_id = existing.doc_id
            await self._delete_old_chunks(existing)

        parser = get_parser(file_path)
        parsed = parser.parse(file_path)

        chunks = self.chunker.chunk(
            parsed.content,
            metadata={
                **parsed.metadata,
                "doc_id": doc_id,
                "repository": repository,
                "project": project,
            },
        )

        if not chunks:
            return {"doc_id": doc_id, "chunks": 0, "file_path": str(path)}

        texts = [c.content for c in chunks]
        embeddings = await self.embedding_service.embed_texts(texts)

        records = [
            VectorRecord(
                id=f"{doc_id}_chunk_{chunk.index}",
                content=chunk.content,
                embedding=embedding,
                metadata={
                    **chunk.metadata,
                    "chunk_index": chunk.index,
                },
            )
            for chunk, embedding in zip(chunks, embeddings, strict=False)
        ]

        inserted = await self.vector_store.insert(records)

        meta = DocumentMetadata(
            doc_id=doc_id,
            file_path=str(path),
            filename=path.name,
            file_extension=path.suffix.lower(),
            file_size_bytes=path.stat().st_size if path.exists() else 0,
            document_type=parsed.metadata.get("document_type", "unknown"),
            language=parsed.metadata.get("language", "unknown"),
            repository=repository,
            project=project,
            chunk_count=inserted,
        )
        self.metadata_store.upsert(meta)

        logger.info(
            "Ingested %s -> %d chunks (doc_id=%s)",
            path.name,
            inserted,
            doc_id,
        )

        return {
            "doc_id": doc_id,
            "chunks": inserted,
            "file_path": str(path),
            "filename": path.name,
        }

    async def ingest_directory(
        self,
        directory: str,
        repository: str = "",
        project: str = "",
        extensions: list[str] | None = None,
    ) -> list[dict]:
        results: list[dict] = []
        path = Path(directory)

        if not path.exists():
            logger.warning("Directory does not exist: %s", directory)
            return results

        skip_dirs = {
            "node_modules",
            "__pycache__",
            ".git",
            ".venv",
            "venv",
            "dist",
            "build",
            ".next",
            ".nuxt",
            "coverage",
            ".mypy_cache",
            ".pytest_cache",
            "egg-info",
        }

        for file_path in sorted(path.rglob("*")):
            if not file_path.is_file():
                continue
            if any(part in skip_dirs for part in file_path.parts):
                continue
            if extensions and file_path.suffix.lower() not in extensions:
                continue

            try:
                result = await self.ingest_file(
                    str(file_path),
                    repository=repository,
                    project=project,
                )
                results.append(result)
            except Exception as e:
                logger.warning("Failed to ingest %s: %s", file_path, e)

        logger.info(
            "Directory ingestion complete: %s -> %d files",
            directory,
            len(results),
        )
        return results

    async def _delete_old_chunks(self, meta: DocumentMetadata) -> None:
        chunk_ids = [f"{meta.doc_id}_chunk_{i}" for i in range(meta.chunk_count)]
        await self.vector_store.delete(chunk_ids)
        self.metadata_store.delete(meta.doc_id)
