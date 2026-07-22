from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.assistant import Message
from app.core.logging import get_logger

logger = get_logger("message_repo")


class MessageRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        message_id: str,
        conversation_id: str,
        role: str,
        content: str,
    ) -> Message:
        now = datetime.now(timezone.utc)
        message = Message(
            id=message_id,
            conversation_id=conversation_id,
            role=role,
            content=content,
            created_at=now,
        )
        self.session.add(message)
        await self.session.flush()
        logger.debug("Created message %s in conversation %s", message_id, conversation_id)
        return message

    async def list_by_conversation(
        self,
        conversation_id: str,
        limit: int = 100,
        offset: int = 0,
    ) -> list[Message]:
        stmt = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_last_by_conversation(
        self, conversation_id: str, role: str | None = None
    ) -> Message | None:
        stmt = select(Message).where(Message.conversation_id == conversation_id)
        if role:
            stmt = stmt.where(Message.role == role)
        stmt = stmt.order_by(Message.created_at.desc()).limit(1)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
