from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_async_session
from app.dependencies.services import get_db_session
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.common import (
    HealthResponse,
    SuggestionsResponse,
    SuggestionItem,
)
from app.schemas.conversation import (
    ConversationCreate,
    ConversationListResponse,
    ConversationResponse,
)
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("assistant.api")

router = APIRouter(prefix="/assistant", tags=["assistant"])


# ---------------------------------------------------------------------------
# Dependency overrides (proper FastAPI DI wiring)
# ---------------------------------------------------------------------------

async def _get_chat_service(
    session: AsyncSession = Depends(get_async_session),
) -> ChatService:
    from app.repositories.conversation_repository import ConversationRepository
    from app.repositories.message_repository import MessageRepository

    return ChatService(
        conversation_repo=ConversationRepository(session),
        message_repo=MessageRepository(session),
    )


async def _get_conversation_service(
    session: AsyncSession = Depends(get_async_session),
) -> ConversationService:
    from app.repositories.conversation_repository import ConversationRepository

    return ConversationService(
        conversation_repo=ConversationRepository(session),
    )


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@router.get("/health", response_model=HealthResponse, summary="Health check")
async def health_check() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        service=settings.APP_NAME,
    )


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------

@router.post("/chat", response_model=ChatResponse, summary="Send a chat message")
async def chat(
    request: ChatRequest,
    service: ChatService = Depends(_get_chat_service),
) -> ChatResponse:
    logger.info("Chat request: conversation_id=%s model=%s", request.conversation_id, request.model)
    return await service.send_message(request)


# ---------------------------------------------------------------------------
# Conversations
# ---------------------------------------------------------------------------

@router.get(
    "/conversations",
    response_model=ConversationListResponse,
    summary="List conversations",
)
async def list_conversations(
    limit: int = 50,
    offset: int = 0,
    service: ConversationService = Depends(_get_conversation_service),
) -> ConversationListResponse:
    return await service.list_conversations(limit=limit, offset=offset)


@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=201,
    summary="Create a conversation",
)
async def create_conversation(
    data: ConversationCreate,
    service: ConversationService = Depends(_get_conversation_service),
) -> ConversationResponse:
    return await service.create_conversation(data)


@router.delete(
    "/conversations/{conversation_id}",
    status_code=204,
    summary="Delete a conversation",
)
async def delete_conversation(
    conversation_id: str,
    service: ConversationService = Depends(_get_conversation_service),
) -> None:
    await service.delete_conversation(conversation_id)


# ---------------------------------------------------------------------------
# Suggestions
# ---------------------------------------------------------------------------

_SUGGESTIONS: list[dict[str, str]] = [
    {"id": "s1", "text": "Explain backend architecture", "category": "architecture"},
    {"id": "s2", "text": "Which project uses Redis?", "category": "infrastructure"},
    {"id": "s3", "text": "Explain login flow", "category": "auth"},
    {"id": "s4", "text": "Show PostgreSQL schema", "category": "database"},
    {"id": "s5", "text": "Explain Docker setup", "category": "devops"},
    {"id": "s6", "text": "How do I deploy this project?", "category": "devops"},
]


@router.get(
    "/suggestions",
    response_model=SuggestionsResponse,
    summary="Get suggested prompts",
)
async def get_suggestions() -> SuggestionsResponse:
    return SuggestionsResponse(
        suggestions=[SuggestionItem(**s) for s in _SUGGESTIONS]
    )
