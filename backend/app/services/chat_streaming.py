import json
import uuid

from fastapi.responses import StreamingResponse

from app.citation import compute_confidence, extract_citations
from app.context import build_context_from_results
from app.core.logging import get_logger
from app.generation import GenerationPipeline
from app.llm import LLMMessage, get_llm
from app.memory import get_memory_manager
from app.prompt import build_system_prompt, build_user_prompt
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.chat import ChatRequest

logger = get_logger("chat.streaming")


class StreamingChatService:
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

    async def stream_chat(self, request: ChatRequest):
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

        await self.memory_manager.add_to_session(
            session_id=conversation_id,
            role="user",
            content=user_message_content,
        )

        await self.memory_manager.load_conversation_history(
            conversation_id=conversation_id,
            session_id=conversation_id,
        )

        retrieval_results = await self.generation_pipeline.retrieval.search(
            query=user_message_content,
            top_k=5,
        )

        results_as_dicts = [
            {
                "id": r.id,
                "content": r.content,
                "score": r.score,
                "metadata": r.metadata,
            }
            for r in retrieval_results
        ]

        built_context = build_context_from_results(results_as_dicts)

        scores = [r.score for r in retrieval_results]

        context_messages = [
            LLMMessage(role="system", content=build_system_prompt()),
            LLMMessage(
                role="user",
                content=build_user_prompt(user_message_content, built_context.context_block),
            ),
        ]

        llm = get_llm()

        async def event_stream():
            full_content = ""

            yield f"data: {json.dumps({'type': 'meta', 'conversation_id': conversation_id})}\n\n"

            doc_summaries = [
                {
                    "id": doc.id,
                    "file_path": doc.file_path,
                    "filename": doc.filename,
                    "score": doc.score,
                    "document_type": doc.document_type,
                    "language": doc.language,
                    "chunk_index": doc.chunk_index,
                }
                for doc in built_context.documents
            ]

            yield f"data: {json.dumps({'type': 'documents', 'documents': doc_summaries})}\n\n"

            try:
                async for chunk in llm.chat_stream(
                    messages=context_messages,
                    temperature=0.1,
                    max_tokens=4096,
                ):
                    if isinstance(chunk, str):
                        full_content += chunk
                        yield f"data: {json.dumps({'type': 'content', 'content': chunk})}\n\n"
            except Exception as e:
                logger.exception("Streaming generation failed: %s", e)
                yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
                return

            citation_result = extract_citations(full_content)
            confidence = compute_confidence(
                scores=scores,
                has_citations=bool(citation_result.source_references),
                has_context=built_context.has_relevant_docs,
            )

            sources_used = citation_result.source_references
            if not sources_used:
                sources_used = [
                    doc.file_path or doc.filename
                    for doc in built_context.documents
                    if doc.file_path or doc.filename
                ]

            await self.message_repo.create(
                message_id=str(uuid.uuid4()),
                conversation_id=conversation_id,
                role="assistant",
                content=full_content,
            )

            await self.memory_manager.add_to_session(
                session_id=conversation_id,
                role="assistant",
                content=full_content,
            )

            await self.conversation_repo.touch(conversation_id)

            yield f"data: {json.dumps({'type': 'done', 'confidence_score': confidence, 'sources_used': sources_used, 'conversation_id': conversation_id})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    def _derive_title(self, message: str) -> str:
        if len(message) <= 60:
            return message
        return message[:57] + "..."
