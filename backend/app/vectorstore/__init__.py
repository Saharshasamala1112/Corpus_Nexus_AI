from app.core.config import get_settings
from app.core.logging import get_logger
from app.vectorstore.base import BaseVectorStore

_vector_store: BaseVectorStore | None = None
_logger = get_logger("vectorstore")


def get_vector_store() -> BaseVectorStore:
    global _vector_store
    if _vector_store is None:
        settings = get_settings()
        store_type = settings.VECTOR_STORE_TYPE.lower()
        if store_type == "chroma":
            from app.vectorstore.chroma_vectorstore import ChromaVectorStore

            _vector_store = ChromaVectorStore()
            _logger.info("Using ChromaDB vector store")
        else:
            from app.vectorstore.in_memory_vectorstore import InMemoryVectorStore

            _vector_store = InMemoryVectorStore()
            _logger.info("Using in-memory vector store (no persistence)")
    return _vector_store


def set_vector_store(store: BaseVectorStore) -> None:
    global _vector_store
    _vector_store = store
