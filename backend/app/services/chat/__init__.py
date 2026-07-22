import uuid

from app.core.logging import get_logger
from app.generation import GenerationPipeline, GeneratedResponse
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.chat import ChatMessage, ChatRequest, ChatResponse, RetrievedDocument

logger = get_logger("chat.service")


class RAGChatService:
    def __init__(
        self,
        conversation_repo: ConversationRepository,
        message_repo: MessageRepository,
        generation_pipeline: GenerationPipeline | None = None,
    ):
        self.conversation_repo = conversation_repo
        self.message_repo = message_repo
        self.generation_pipeline = generation_pipeline or GenerationPipeline()

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

        await self.message_repo.create(
            message_id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            role="user",
            content=user_message_content,
        )

        generation_result = await self.generation_pipeline.generate(
            query=user_message_content,
            top_k=5,
        )

        assistant_content = self._format_response(user_message_content, generation_result)

        await self.message_repo.create(
            message_id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            role="assistant",
            content=assistant_content,
        )

        await self.conversation_repo.touch(conversation_id)

        logger.info(
            "RAG chat completed: conversation=%s model=%s confidence=%.2f sources=%d",
            conversation_id,
            request.model,
            generation_result.confidence_score,
            len(generation_result.sources_used),
        )

        return ChatResponse(
            message=ChatMessage(role="assistant", content=assistant_content),
            conversation_id=conversation_id,
            model=request.model,
            confidence_score=generation_result.confidence_score,
            sources_used=generation_result.sources_used,
            retrieved_documents=[
                RetrievedDocument(**doc) for doc in generation_result.retrieved_documents
            ],
        )

    def _format_response(self, query: str, result: GeneratedResponse) -> str:
        return result.answer

    def _derive_title(self, message: str) -> str:
        if len(message) <= 60:
            return message
        return message[:57] + "..."
