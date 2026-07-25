from __future__ import annotations
from typing import Dict, List
import uuid


class ConversationRepository:
    def __init__(self):
        self._store: Dict[str, dict] = {}

    async def create(self, conversation_id: str, title: str, model: str | None = None):
        self._store[conversation_id] = {"id": conversation_id, "title": title, "model": model, "messages": [], "updated_at": None, "owner": None}
        return self._store[conversation_id]

    async def get_by_id(self, conversation_id: str) -> dict | None:
        return self._store.get(conversation_id)

    async def list(self, owner: str | None = None, limit: int = 50, offset: int = 0) -> List[dict]:
        items = list(self._store.values())
        if owner:
            items = [i for i in items if i.get('owner') == owner]
        return items[offset: offset + limit]

    async def touch(self, conversation_id: str):
        item = self._store.get(conversation_id)
        if item:
            item["updated_at"] = "now"

    async def set_owner(self, conversation_id: str, owner: str):
        item = self._store.get(conversation_id)
        if item:
            item['owner'] = owner


conversation_repo = ConversationRepository()

# optionally swap to SQL-backed repos if available
try:
    from app.services.persistence_sql import create_sql_repos_if_available
    sql_conv, sql_msg = create_sql_repos_if_available()
    if sql_conv is not None:
        conversation_repo = sql_conv
except Exception:
    pass
