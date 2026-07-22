from pydantic import BaseModel, Field


class IndexRequest(BaseModel):
    repository_path: str = Field(..., description="Path to repository or directory")
    repository_name: str = Field(..., description="Name identifier for the repository")
    extensions: list[str] | None = Field(
        default=None,
        description="File extensions to index (e.g. ['.py', '.ts']). None = all supported.",
    )


class IndexResponse(BaseModel):
    repository: str
    files_indexed: int
    total_chunks: int


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="Search query")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of results")
    repository: str | None = Field(default=None, description="Filter by repository")


class SearchResultItem(BaseModel):
    id: str
    content: str
    score: float
    metadata: dict


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResultItem]
    total: int


class KnowledgeStatusResponse(BaseModel):
    total_documents: int
    total_chunks: int
    by_type: dict[str, int]
    by_language: dict[str, int]


class ReindexResponse(BaseModel):
    repository: str
    files_indexed: int
    total_chunks: int
    message: str
