from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import async_session_factory
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


def get_conversation_repository(
    session: AsyncSession = None,  # type: ignore[assignment]
) -> ConversationRepository:
    return ConversationRepository(session)


def get_message_repository(
    session: AsyncSession = None,  # type: ignore[assignment]
) -> MessageRepository:
    return MessageRepository(session)


async def get_chat_service(
    session: AsyncSession = None,  # type: ignore[assignment]
) -> ChatService:
    return ChatService(
        conversation_repo=ConversationRepository(session),
        message_repo=MessageRepository(session),
    )


async def get_conversation_service(
    session: AsyncSession = None,  # type: ignore[assignment]
) -> ConversationService:
    return ConversationService(
        conversation_repo=ConversationRepository(session),
    )
