from dataclasses import dataclass, field


@dataclass
class ContextDocument:
    id: str
    content: str
    score: float
    file_path: str = ""
    filename: str = ""
    document_type: str = ""
    language: str = ""
    repository: str = ""
    project: str = ""
    chunk_index: int = 0
    additional_metadata: dict = field(default_factory=dict)


@dataclass
class BuiltContext:
    documents: list[ContextDocument]
    context_block: str
    document_count: int
    has_relevant_docs: bool


def build_context_from_results(
    results: list[dict],
    min_score: float = 0.0,
) -> BuiltContext:
    documents: list[ContextDocument] = []

    for r in results:
        if r.get("score", 0) < min_score:
            continue

        meta = r.get("metadata", {})
        doc = ContextDocument(
            id=r.get("id", ""),
            content=r.get("content", ""),
            score=r.get("score", 0.0),
            file_path=meta.get("file_path", ""),
            filename=meta.get("filename", ""),
            document_type=meta.get("document_type", ""),
            language=meta.get("language", ""),
            repository=meta.get("repository", ""),
            project=meta.get("project", ""),
            chunk_index=meta.get("chunk_index", 0),
            additional_metadata={
                k: v
                for k, v in meta.items()
                if k
                not in {
                    "file_path",
                    "filename",
                    "document_type",
                    "language",
                    "repository",
                    "project",
                    "chunk_index",
                    "doc_id",
                }
            },
        )
        documents.append(doc)

    has_relevant = len(documents) > 0 and any(d.score > 0.01 for d in documents)

    context_block = _format_context(documents) if documents else "[No relevant documents found]"

    return BuiltContext(
        documents=documents,
        context_block=context_block,
        document_count=len(documents),
        has_relevant_docs=has_relevant,
    )


def _format_context(documents: list[ContextDocument]) -> str:
    parts: list[str] = []

    for i, doc in enumerate(documents, 1):
        source_label = doc.file_path or doc.filename or doc.id
        parts.append(
            f"--- Document {i} [score: {doc.score:.4f}] ---\n"
            f"Source: {source_label}\n"
            f"Type: {doc.document_type} | Language: {doc.language}\n"
            f"Content:\n{doc.content}\n"
        )

    return "\n".join(parts)
