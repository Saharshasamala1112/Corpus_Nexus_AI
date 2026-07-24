import json
import uuid

from fastapi.responses import StreamingResponse

from app.ai_router import RoutingMode, get_greeting_response
from app.citation import compute_confidence, extract_citations
from app.context import build_context_from_results
from app.core.logging import get_logger
from app.llm import LLMMessage, get_llm
from app.prompt import build_system_prompt, build_user_prompt
from app.schemas.chat import ChatRequest
from app.services.chat import BaseChatService

logger = get_logger("chat.streaming")


class StreamingChatService(BaseChatService):
    async def stream_chat(self, request: ChatRequest):
        conversation_id = request.conversation_id
        user_message_content = request.message.strip()

        conversation_id = await self._ensure_conversation(
            conversation_id, user_message_content, request.model
        )

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

        await self._load_memory(conversation_id)

        decision, _, _ = await self._route_query(user_message_content)
        mode = decision.mode

        if decision.intent == "greeting":
            response_text = get_greeting_response()

            await self.message_repo.create(
                message_id=str(uuid.uuid4()),
                conversation_id=conversation_id,
                role="assistant",
                content=response_text,
            )

            await self.memory_manager.add_to_session(
                session_id=conversation_id,
                role="assistant",
                content=response_text,
            )

            await self.conversation_repo.touch(conversation_id)

            async def greeting_stream():
                yield f"data: {json.dumps({'type': 'meta', 'conversation_id': conversation_id})}\n\n"
                yield f"data: {json.dumps({'type': 'content', 'content': response_text})}\n\n"
                yield f"data: {json.dumps({'type': 'done', 'confidence_score': 100.0, 'sources_used': [], 'conversation_id': conversation_id, 'routing_mode': 'general'})}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingResponse(
                greeting_stream(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no",
                },
            )

        retrieval_results = await self.generation_pipeline.retrieval.search(
            query=user_message_content,
            top_k=5,
        )

        scores = [r.score for r in retrieval_results]

        if mode == RoutingMode.GENERAL:
            context_messages = [
                LLMMessage(role="system", content=build_system_prompt(mode)),
                LLMMessage(
                    role="user",
                    content=build_user_prompt(user_message_content, mode=mode),
                ),
            ]
            built_context = None
        else:
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

            context_messages = [
                LLMMessage(role="system", content=build_system_prompt(mode)),
                LLMMessage(
                    role="user",
                    content=build_user_prompt(
                        user_message_content, built_context.context_block, mode
                    ),
                ),
            ]

        llm = get_llm()

        async def event_stream():
            full_content = ""

            yield f"data: {json.dumps({'type': 'meta', 'conversation_id': conversation_id, 'routing_mode': mode.value})}\n\n"

            if built_context:
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

            if built_context:
                citation_result = extract_citations(full_content)
                confidence = compute_confidence(
                    scores=scores,
                    has_citations=bool(citation_result.source_references),
                    has_context=built_context.has_relevant_docs,
                )
                if mode == RoutingMode.HYBRID:
                    confidence = max(confidence, 50.0)
                sources_used = citation_result.source_references
                if not sources_used:
                    sources_used = [
                        doc.file_path or doc.filename
                        for doc in built_context.documents
                        if doc.file_path or doc.filename
                    ]
            else:
                confidence = 100.0
                sources_used = []

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

            yield f"data: {json.dumps({'type': 'done', 'confidence_score': confidence, 'sources_used': sources_used, 'conversation_id': conversation_id, 'routing_mode': mode.value})}\n\n"
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
