"""Tests for memory system."""

from app.memory import ConversationMemoryManager, MemoryEntry, SessionMemory


class TestSessionMemory:
    def test_add_entry(self):
        s = SessionMemory(session_id="test-session")
        s.add_entry("user", "hello")
        s.add_entry("assistant", "hi there")
        assert len(s.entries) == 2
        assert s.turn_count == 2

    def test_get_recent_context(self):
        s = SessionMemory(session_id="test")
        s.add_entry("user", "first message")
        s.add_entry("assistant", "first reply")
        ctx = s.get_recent_context(limit=10)
        assert "User: first message" in ctx
        assert "Assistant: first reply" in ctx

    def test_to_llm_messages(self):
        s = SessionMemory(session_id="test")
        s.add_entry("user", "hello")
        msgs = s.to_llm_messages(limit=10)
        assert len(msgs) == 1
        assert msgs[0].role == "user"
        assert msgs[0].content == "hello"

    def test_to_llm_messages_with_summary(self):
        s = SessionMemory(session_id="test")
        s.context_summary = "User asked about auth"
        s.add_entry("user", "hello")
        msgs = s.to_llm_messages(limit=10)
        assert len(msgs) == 2
        assert msgs[0].role == "system"
        assert "auth" in msgs[0].content


class TestMemoryEntry:
    def test_default_summary(self):
        entry = MemoryEntry(content="hello", role="user")
        assert entry.summary == ""
        assert entry.role == "user"


class TestConversationMemoryManager:
    def test_get_or_create_session(self):
        mgr = ConversationMemoryManager()
        s1 = mgr.get_or_create_session("s1")
        s2 = mgr.get_or_create_session("s1")
        assert s1 is s2

    def test_clear_session(self):
        mgr = ConversationMemoryManager()
        mgr.get_or_create_session("s1")
        mgr.clear_session("s1")
        s = mgr.get_or_create_session("s1")
        assert s.turn_count == 0

    def test_clear_all(self):
        mgr = ConversationMemoryManager()
        mgr.get_or_create_session("s1")
        mgr.get_or_create_session("s2")
        mgr.clear_all()
        assert len(mgr._sessions) == 0
