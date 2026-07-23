import uuid

from app.ai_router import get_ai_router, get_greeting_response
from app.core.logging import get_logger
from app.generation import GenerationPipeline
from app.memory import get_memory_manager
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.chat import ChatMessage, ChatRequest, ChatResponse, RetrievedDocument

logger = get_logger("chat.service")


class BaseChatService:
    def __init__(
        self,
        conversation_repo: ConversationRepository,
        message_repo: MessageRepository,
        generation_pipeline: GenerationPipeline | None = None,
    ):
        self.conversation_repo = conversation_repo
        self.message_repo = message_repo
        self.generation_pipeline = generation_pipeline or GenerationPipeline()
        self.memory_manager = get_memory_manager()
        self.ai_router = get_ai_router()

    async def _ensure_conversation(
        self, conversation_id: str | None, content: str, model: str
    ) -> str:
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
            await self.conversation_repo.create(
                conversation_id=conversation_id,
                title=self._derive_title(content),
                model=model,
            )
        conversation = await self.conversation_repo.get_by_id(conversation_id)
        if not conversation:
            from app.core.exceptions import NotFoundException

            raise NotFoundException("Conversation", conversation_id)
        return conversation_id

    async def _load_memory(self, conversation_id: str) -> None:
        await self.memory_manager.load_conversation_history(
            conversation_id=conversation_id,
            session_id=conversation_id,
            message_repo=self.message_repo,
        )

    def _derive_title(self, message: str) -> str:
        if len(message) <= 60:
            return message
        return message[:57] + "..."

    async def _route_query(self, query: str) -> tuple:
        retrieval_results = await self.generation_pipeline.retrieval.search(
            query=query,
            top_k=5,
        )
        scores = [r.score for r in retrieval_results]
        max_score = max(scores) if scores else 0.0
        avg_score = sum(scores) / len(scores) if scores else 0.0
        has_relevant = any(s > 0.01 for s in scores)

        decision = await self.ai_router.route(
            query=query,
            max_score=max_score,
            avg_score=avg_score,
            document_count=len(retrieval_results),
            has_relevant_docs=has_relevant,
        )
        return decision, max_score, avg_score


class RAGChatService(BaseChatService):
    async def send_message(self, request: ChatRequest) -> ChatResponse:
        conversation_id = request.conversation_id
        user_message_content = request.message.strip()

        conversation_id = await self._ensure_conversation(
            conversation_id, user_message_content, request.model
        )

        await self.memory_manager.add_to_session(
            session_id=conversation_id,
            role="user",
            content=user_message_content,
        )

        await self._load_memory(conversation_id)

        decision, _, _ = await self._route_query(user_message_content)

        if decision.intent == "greeting":
            response_text = get_greeting_response()

            await self.memory_manager.add_to_session(
                session_id=conversation_id,
                role="assistant",
                content=response_text,
            )

            await self.conversation_repo.touch(conversation_id)

            return ChatResponse(
                message=ChatMessage(role="assistant", content=response_text),
                conversation_id=conversation_id,
                model=request.model,
                confidence_score=100.0,
                routing_mode="general",
            )

        generation_result = await self.generation_pipeline.generate(
            query=user_message_content,
            top_k=5,
            mode=decision.mode,
        )

        assistant_content = generation_result.answer

        await self.memory_manager.add_to_session(
            session_id=conversation_id,
            role="assistant",
            content=assistant_content,
        )

        follow_up_questions = await self.memory_manager.generate_followup_questions(
            session_id=conversation_id,
            query=user_message_content,
            answer=assistant_content,
        )

        await self.conversation_repo.touch(conversation_id)

        logger.info(
            "RAG chat completed: conversation=%s model=%s mode=%s confidence=%.2f sources=%d",
            conversation_id,
            request.model,
            decision.mode.value,
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
            related_documents=[
                RetrievedDocument(**doc) for doc in generation_result.related_documents
            ],
            related_repositories=generation_result.related_repositories,
            token_usage=generation_result.token_usage,
            follow_up_questions=follow_up_questions,
            routing_mode=generation_result.routing_mode,
        )
