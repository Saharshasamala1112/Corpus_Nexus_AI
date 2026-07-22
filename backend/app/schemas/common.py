from typing import Any

from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    code: int
    message: str
    detail: Any = None


class ErrorResponse(BaseModel):
    error: ErrorDetail


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str
    service: str


class SuggestionItem(BaseModel):
    id: str
    text: str
    category: str


class SuggestionsResponse(BaseModel):
    suggestions: list[SuggestionItem]
