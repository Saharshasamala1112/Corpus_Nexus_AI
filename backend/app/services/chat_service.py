import uuid

from app.core.logging import get_logger
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.chat import ChatMessage, ChatRequest, ChatResponse

logger = get_logger("chat_service")

MOCK_RESPONSES: dict[str, str] = {
    "explain backend architecture": (
        "This is a mock response about backend architecture. "
        "The CorpusGuard AI backend follows a modular FastAPI architecture with "
        "clean separation of concerns: routers handle HTTP, services handle business "
        "logic, repositories handle data access, and models define the schema. "
        "RAG integration will be added later."
    ),
    "which project uses redis": (
        "This is a mock response about Redis usage. "
        "Redis is used for session caching, rate limiting, search query caching, "
        "and real-time pub/sub features. "
        "RAG integration will be added later."
    ),
    "explain login flow": (
        "This is a mock response about the login flow. "
        "The authentication uses JWT tokens with access/refresh pattern. "
        "Passwords are hashed with bcrypt. "
        "RAG integration will be added later."
    ),
    "explain docker setup": (
        "This is a mock response about the Docker setup. "
        "The project uses Docker Compose for local development with multi-service "
        "orchestration including backend, frontend, database, and Redis containers. "
        "RAG integration will be added later."
    ),
}

DEFAULT_RESPONSE = (
    "This is a mock response. RAG integration will be added later."
)


class ChatService:
    def __init__(
        self,
        conversation_repo: ConversationRepository,
        message_repo: MessageRepository,
    ):
        self.conversation_repo = conversation_repo
        self.message_repo = message_repo

    async def send_message(self, request: ChatRequest) -> ChatResponse:
        conversation_id = request.conversation_id
        user_message_content = request.message.strip()

        if not conversation_id:
            conversation_id = str(uuid.uuid4())
            title = self._derive_title(user_message_content)
            await self.conversation_repo.create(
                conversation_id=conversation_id,
                title=title,
                model=request.model,
            )

        conversation = await self.conversation_repo.get_by_id(conversation_id)
        if not conversation:
            from app.core.exceptions import NotFoundException

            raise NotFoundException("Conversation", conversation_id)

        user_msg = await self.message_repo.create(
            message_id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            role="user",
            content=user_message_content,
        )

        assistant_content = self._generate_mock_response(user_message_content)
        assistant_msg = await self.message_repo.create(
            message_id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            role="assistant",
            content=assistant_content,
        )

        await self.conversation_repo.touch(conversation_id)

        logger.info(
            "Chat completed: conversation=%s model=%s",
            conversation_id,
            request.model,
        )

        return ChatResponse(
            message=ChatMessage(role="assistant", content=assistant_content),
            conversation_id=conversation_id,
            model=request.model,
        )

    def _generate_mock_response(self, user_message: str) -> str:
        lower = user_message.lower()
        for key, response in MOCK_RESPONSES.items():
            if key in lower:
                return response
        return DEFAULT_RESPONSE

    def _derive_title(self, message: str) -> str:
        if len(message) <= 60:
            return message
        return message[:57] + "..."
