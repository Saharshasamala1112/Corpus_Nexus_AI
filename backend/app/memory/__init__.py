import json
import uuid
from dataclasses import dataclass, field
from datetime import UTC, datetime

from app.core.logging import get_logger
from app.llm import BaseLLM, LLMMessage, get_llm
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository

logger = get_logger("memory")


@dataclass
class MemoryEntry:
    content: str
    role: str
    timestamp: datetime = field(default_factory=lambda: datetime.now(UTC))
    summary: str = ""


@dataclass
class SessionMemory:
    session_id: str
    entries: list[MemoryEntry] = field(default_factory=list)
    context_summary: str = ""
    turn_count: int = 0

    def add_entry(self, role: str, content: str) -> None:
        self.entries.append(MemoryEntry(content=content, role=role))
        self.turn_count += 1

    def get_recent_context(self, limit: int = 10) -> str:
        recent = self.entries[-limit:] if len(self.entries) > limit else self.entries
        parts = []
        for entry in recent:
            prefix = "User" if entry.role == "user" else "Assistant"
            parts.append(f"{prefix}: {entry.content[:200]}")
        return "\n".join(parts)

    def to_llm_messages(self, limit: int = 20) -> list[LLMMessage]:
        recent = self.entries[-limit:] if len(self.entries) > limit else self.entries
        messages = []
        if self.context_summary:
            messages.append(
                LLMMessage(
                    role="system",
                    content=f"Previous conversation summary:\n{self.context_summary}",
                )
            )
        for entry in recent:
            messages.append(LLMMessage(role=entry.role, content=entry.content))
        return messages


_summarization_prompt = """Summarize the key points from this conversation. Focus on:

1. What the user asked about
2. What information was found/provided
3. Any decisions or conclusions reached
4. Any unresolved questions

Keep the summary concise (2-4 sentences).

Conversation:
{conversation_text}

Summary:"""

_followup_prompt = """Based on this conversation, suggest 3 relevant follow-up questions the user might want to ask.

Conversation:
{conversation_text}

Return ONLY a JSON array of strings, like:
["question 1?", "question 2?", "question 3?"]

Follow-up questions:"""


class ConversationMemoryManager:
    def __init__(
        self,
        conversation_repo: ConversationRepository | None = None,
        message_repo: MessageRepository | None = None,
        llm: BaseLLM | None = None,
        max_history_turns: int = 20,
    ):
        self.conversation_repo = conversation_repo
        self.message_repo = message_repo
        self.llm = llm or get_llm()
        self.max_history_turns = max_history_turns
        self._sessions: dict[str, SessionMemory] = {}

    def get_or_create_session(self, session_id: str) -> SessionMemory:
        if session_id not in self._sessions:
            self._sessions[session_id] = SessionMemory(session_id=session_id)
        return self._sessions[session_id]

    async def add_to_session(
        self,
        session_id: str,
        role: str,
        content: str,
        conversation_id: str | None = None,
    ) -> None:
        session = self.get_or_create_session(session_id)
        session.add_entry(role, content)

        if self.message_repo and conversation_id:
            try:
                await self.message_repo.create(
                    message_id=str(uuid.uuid4()),
                    conversation_id=conversation_id,
                    role=role,
                    content=content,
                )
            except Exception as e:
                logger.warning("Failed to persist message to DB: %s", e)

        if session.turn_count > 0 and session.turn_count % 5 == 0:
            await self._summarize_context(session_id)

    async def load_conversation_history(
        self,
        conversation_id: str,
        session_id: str,
    ) -> SessionMemory:
        session = self.get_or_create_session(session_id)

        if self.message_repo and self.conversation_repo:
            try:
                messages = await self.message_repo.list_by_conversation(conversation_id)
                for msg in messages:
                    session.add_entry(msg.role, msg.content)

                if len(messages) > 10:
                    await self._summarize_context(session_id)
            except Exception as e:
                logger.warning("Failed to load conversation history: %s", e)

        return session

    async def get_context_for_query(
        self,
        session_id: str,
        query: str,
    ) -> tuple[str, list[LLMMessage]]:
        session = self.get_or_create_session(session_id)
        memory_messages = session.to_llm_messages(limit=self.max_history_turns)
        context = session.get_recent_context(limit=6)

        if session.context_summary:
            context = (
                f"Conversation Summary:\n{session.context_summary}\n\nRecent Messages:\n{context}"
            )

        return context, memory_messages

    async def generate_followup_questions(
        self,
        session_id: str,
        query: str,
        answer: str,
    ) -> list[str]:
        session = self.get_or_create_session(session_id)
        conversation_text = (
            f"User: {query}\n\nAssistant: {answer}\n\n"
            f"Previous: {session.get_recent_context(limit=4)}"
        )

        try:
            response = await self.llm.chat(
                messages=[
                    LLMMessage(
                        role="system",
                        content=_followup_prompt.format(conversation_text=conversation_text[:4000]),
                    ),
                ],
                temperature=0.3,
                max_tokens=512,
            )

            text = response.content.strip()
            if text.startswith("```"):
                lines = text.split("\n")
                lines = [line for line in lines if not line.strip().startswith("```")]
                text = "\n".join(lines)

            questions = json.loads(text)
            if isinstance(questions, list):
                return [q for q in questions if isinstance(q, str)][:3]
        except Exception as e:
            logger.warning("Failed to generate follow-up questions: %s", e)

        return [
            "Can you elaborate on that?",
            "What related information is available?",
            "Show me the relevant source files.",
        ]

    async def _summarize_context(self, session_id: str) -> None:
        session = self.get_or_create_session(session_id)
        conversation_text = session.get_recent_context(limit=10)

        try:
            response = await self.llm.chat(
                messages=[
                    LLMMessage(
                        role="system",
                        content=_summarization_prompt.format(conversation_text=conversation_text),
                    ),
                ],
                temperature=0.1,
                max_tokens=512,
            )
            session.context_summary = response.content
            logger.info(
                "Context summarized for session %s: %s",
                session_id,
                response.content[:100],
            )
        except Exception as e:
            logger.warning("Failed to summarize context: %s", e)

    def clear_session(self, session_id: str) -> None:
        self._sessions.pop(session_id, None)

    def clear_all(self) -> None:
        self._sessions.clear()


_memory_manager: ConversationMemoryManager | None = None


def get_memory_manager() -> ConversationMemoryManager:
    global _memory_manager
    if _memory_manager is None:
        _memory_manager = ConversationMemoryManager()
    return _memory_manager
