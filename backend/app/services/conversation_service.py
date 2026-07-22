from app.core.logging import get_logger
from app.repositories.conversation_repository import ConversationRepository
from app.schemas.conversation import (
    ConversationCreate,
    ConversationDetail,
    ConversationListResponse,
    ConversationResponse,
    MessageResponse,
)
from app.core.exceptions import NotFoundException

logger = get_logger("conversation_service")


class ConversationService:
    def __init__(self, conversation_repo: ConversationRepository):
        self.conversation_repo = conversation_repo

    async def list_conversations(
        self,
        user_id: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> ConversationListResponse:
        conversations, total = await self.conversation_repo.list_all(
            user_id=user_id, limit=limit, offset=offset
        )
        items = [
            ConversationResponse(
                id=c.id,
                title=c.title,
                model=c.model,
                message_count=len(c.messages),
                created_at=c.created_at,
                updated_at=c.updated_at,
            )
            for c in conversations
        ]
        return ConversationListResponse(conversations=items, total=total)

    async def get_conversation(self, conversation_id: str) -> ConversationDetail:
        conversation = await self.conversation_repo.get_by_id(conversation_id)
        if not conversation:
            raise NotFoundException("Conversation", conversation_id)
        messages = [
            MessageResponse(
                id=m.id,
                role=m.role,
                content=m.content,
                created_at=m.created_at,
            )
            for m in conversation.messages
        ]
        return ConversationDetail(
            id=conversation.id,
            title=conversation.title,
            model=conversation.model,
            messages=messages,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at,
        )

    async def create_conversation(
        self, data: ConversationCreate
    ) -> ConversationResponse:
        import uuid

        conv = await self.conversation_repo.create(
            conversation_id=str(uuid.uuid4()),
            title=data.title,
            model=data.model,
        )
        return ConversationResponse(
            id=conv.id,
            title=conv.title,
            model=conv.model,
            message_count=0,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
        )

    async def delete_conversation(self, conversation_id: str) -> None:
        deleted = await self.conversation_repo.delete(conversation_id)
        if not deleted:
            raise NotFoundException("Conversation", conversation_id)
