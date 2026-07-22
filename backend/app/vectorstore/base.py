from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class VectorRecord:
    id: str
    content: str
    embedding: list[float]
    metadata: dict = field(default_factory=dict)


@dataclass
class SearchResult:
    id: str
    content: str
    score: float
    metadata: dict = field(default_factory=dict)


class BaseVectorStore(ABC):
    @abstractmethod
    async def insert(self, records: list[VectorRecord]) -> int:
        ...

    @abstractmethod
    async def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        filter_metadata: dict | None = None,
    ) -> list[SearchResult]:
        ...

    @abstractmethod
    async def delete(self, ids: list[str]) -> int:
        ...

    @abstractmethod
    async def delete_by_filter(self, filter_metadata: dict) -> int:
        ...

    @abstractmethod
    async def count(self) -> int:
        ...
