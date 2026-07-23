from typing import Any

from pydantic import BaseModel


class ErrorDetail(BaseModel):
    code: int
    message: str
    detail: Any = None


class ErrorResponse(BaseModel):
    error: ErrorDetail


class HealthCheckResult(BaseModel):
    status: str
    detail: str | None = None


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str
    service: str
    checks: dict[str, HealthCheckResult] | None = None


class SuggestionItem(BaseModel):
    id: str
    text: str
    category: str


class SuggestionsResponse(BaseModel):
    suggestions: list[SuggestionItem]
