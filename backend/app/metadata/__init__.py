from dataclasses import dataclass, field
from datetime import UTC, datetime


@dataclass
class DocumentMetadata:
    doc_id: str
    file_path: str
    filename: str
    file_extension: str
    file_size_bytes: int
    document_type: str
    language: str
    repository: str
    project: str
    chunk_count: int = 0
    indexed_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    def to_dict(self) -> dict:
        return {
            "doc_id": self.doc_id,
            "file_path": self.file_path,
            "filename": self.filename,
            "file_extension": self.file_extension,
            "file_size_bytes": self.file_size_bytes,
            "document_type": self.document_type,
            "language": self.language,
            "repository": self.repository,
            "project": self.project,
            "chunk_count": self.chunk_count,
            "indexed_at": self.indexed_at.isoformat(),
        }


class MetadataStore:
    def __init__(self):
        self._documents: dict[str, DocumentMetadata] = {}

    def upsert(self, meta: DocumentMetadata) -> None:
        self._documents[meta.doc_id] = meta

    def get(self, doc_id: str) -> DocumentMetadata | None:
        return self._documents.get(doc_id)

    def get_by_path(self, file_path: str) -> DocumentMetadata | None:
        for meta in self._documents.values():
            if meta.file_path == file_path:
                return meta
        return None

    def list_all(
        self,
        repository: str | None = None,
        project: str | None = None,
    ) -> list[DocumentMetadata]:
        results = list(self._documents.values())
        if repository:
            results = [m for m in results if m.repository == repository]
        if project:
            results = [m for m in results if m.project == project]
        return results

    def delete(self, doc_id: str) -> bool:
        if doc_id in self._documents:
            del self._documents[doc_id]
            return True
        return False

    def delete_by_path(self, file_path: str) -> bool:
        to_delete = [
            doc_id for doc_id, meta in self._documents.items() if meta.file_path == file_path
        ]
        for doc_id in to_delete:
            del self._documents[doc_id]
        return len(to_delete) > 0

    def count(self) -> int:
        return len(self._documents)

    def stats(self) -> dict:
        docs = list(self._documents.values())
        by_type: dict[str, int] = {}
        by_language: dict[str, int] = {}
        total_chunks = 0
        for m in docs:
            by_type[m.document_type] = by_type.get(m.document_type, 0) + 1
            by_language[m.language] = by_language.get(m.language, 0) + 1
            total_chunks += m.chunk_count
        return {
            "total_documents": len(docs),
            "total_chunks": total_chunks,
            "by_type": by_type,
            "by_language": by_language,
        }
