from __future__ import annotations
from typing import Dict, List


class MessageRepository:
    def __init__(self):
        self._messages: Dict[str, dict] = {}

    async def create(self, message_id: str, conversation_id: str, role: str, content: str):
        self._messages[message_id] = {"id": message_id, "conversation_id": conversation_id, "role": role, "content": content}
        return self._messages[message_id]

    async def list_for_conversation(self, conversation_id: str) -> List[dict]:
        return [m for m in self._messages.values() if m["conversation_id"] == conversation_id]


message_repo = MessageRepository()

# optionally swap to SQL-backed repos if available
try:
    from app.services.persistence_sql import create_sql_repos_if_available
    sql_conv, sql_msg = create_sql_repos_if_available()
    if sql_msg is not None:
        message_repo = sql_msg
except Exception:
    pass
