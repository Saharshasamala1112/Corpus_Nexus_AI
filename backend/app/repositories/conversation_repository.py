from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.models.assistant import Conversation

logger = get_logger("conversation_repo")


class ConversationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        conversation_id: str,
        title: str,
        model: str,
        user_id: str | None = None,
    ) -> Conversation:
        now = datetime.now(UTC)
        conversation = Conversation(
            id=conversation_id,
            title=title,
            model=model,
            user_id=user_id,
            created_at=now,
            updated_at=now,
        )
        self.session.add(conversation)
        await self.session.flush()
        logger.info("Created conversation %s", conversation_id)
        return conversation

    async def get_by_id(self, conversation_id: str) -> Conversation | None:
        from sqlalchemy.orm import selectinload

        stmt = (
            select(Conversation)
            .where(Conversation.id == conversation_id)
            .options(selectinload(Conversation.messages))
        )
        result = await self.session.execute(stmt)
        return result.scalars().unique().one_or_none()

    async def list_all(
        self,
        user_id: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[Conversation], int]:
        base_query = select(Conversation)
        if user_id:
            base_query = base_query.where(Conversation.user_id == user_id)

        count_query = select(func.count()).select_from(base_query.subquery())
        total = (await self.session.execute(count_query)).scalar_one()

        from sqlalchemy.orm import selectinload

        items_query = (
            base_query.options(selectinload(Conversation.messages))
            .order_by(Conversation.updated_at.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(items_query)
        conversations = list(result.scalars().unique().all())

        return conversations, total

    async def update_title(self, conversation_id: str, title: str) -> Conversation | None:
        conversation = await self.get_by_id(conversation_id)
        if not conversation:
            return None
        conversation.title = title
        conversation.updated_at = datetime.now(UTC)
        await self.session.flush()
        return conversation

    async def touch(self, conversation_id: str) -> None:
        stmt = select(Conversation).where(Conversation.id == conversation_id).with_for_update()
        result = await self.session.execute(stmt)
        conversation = result.scalar_one_or_none()
        if conversation:
            conversation.updated_at = datetime.now(UTC)
            await self.session.flush()

    async def delete(self, conversation_id: str) -> bool:
        conversation = await self.get_by_id(conversation_id)
        if not conversation:
            return False
        await self.session.delete(conversation)
        await self.session.flush()
        logger.info("Deleted conversation %s", conversation_id)
        return True

    async def delete_all(self, user_id: str | None = None) -> int:
        base_query = select(Conversation)
        if user_id:
            base_query = base_query.where(Conversation.user_id == user_id)
        result = await self.session.execute(base_query)
        conversations = result.scalars().all()
        count = len(conversations)
        for conv in conversations:
            await self.session.delete(conv)
        await self.session.flush()
        logger.info("Deleted %d conversations", count)
        return count
