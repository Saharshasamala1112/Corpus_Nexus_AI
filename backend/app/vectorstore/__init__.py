from app.vectorstore.base import BaseVectorStore
from app.vectorstore.in_memory_vectorstore import InMemoryVectorStore

_vector_store: BaseVectorStore | None = None


def get_vector_store() -> BaseVectorStore:
    global _vector_store
    if _vector_store is None:
        _vector_store = InMemoryVectorStore()
    return _vector_store


def set_vector_store(store: BaseVectorStore) -> None:
    global _vector_store
    _vector_store = store
