from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"] = Field(..., description="Message role")
    content: str = Field(..., min_length=1, description="Message content")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000, description="User message")
    conversation_id: str | None = Field(
        None, description="Existing conversation ID. Omit to start a new conversation."
    )
    model: str = Field(default="gpt-4o", description="Model to use for generation")


class SourceReference(BaseModel):
    filename: str
    file_path: str
    section: str


class RetrievedDocument(BaseModel):
    id: str
    file_path: str
    filename: str
    score: float
    document_type: str
    language: str
    chunk_index: int


class ChatResponse(BaseModel):
    message: ChatMessage
    conversation_id: str
    model: str
    confidence_score: float = 0.0
    sources_used: list[str] = Field(default_factory=list)
    retrieved_documents: list[RetrievedDocument] = Field(default_factory=list)
