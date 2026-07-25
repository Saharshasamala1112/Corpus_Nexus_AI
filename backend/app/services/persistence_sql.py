from typing import Optional


def create_sql_repos_if_available():
    """Try to create SQL-backed conversation and message repos.

    Returns a tuple (ConversationRepoClass, MessageRepoClass) or (None, None)
    """
    try:
        from sqlalchemy import Column, Integer, String, Text, Table, MetaData
        from sqlalchemy import create_engine
        from sqlalchemy.orm import registry, sessionmaker
        from app.db import get_database_url

        db_url = get_database_url()
        if not db_url:
            return None, None

        engine = create_engine(db_url)
        metadata = MetaData()
        mapper_registry = registry(metadata=metadata)

        conversations_table = Table(
            "conversations",
            metadata,
            Column("id", String, primary_key=True),
            Column("title", String(255)),
            Column("model", String(128)),
        )

        messages_table = Table(
            "messages",
            metadata,
            Column("id", String, primary_key=True),
            Column("conversation_id", String),
            Column("role", String(32)),
            Column("content", Text),
        )

        metadata.create_all(engine)
        Session = sessionmaker(bind=engine)

        class SQLConversationRepo:
            def __init__(self):
                self.Session = Session

            async def create(self, conversation_id: str, title: str, model: str | None = None):
                s = self.Session()
                s.execute(conversations_table.insert().values(id=conversation_id, title=title, model=model))
                s.commit()
                s.close()

            async def get_by_id(self, conversation_id: str):
                s = self.Session()
                r = s.execute(conversations_table.select().where(conversations_table.c.id == conversation_id)).first()
                s.close()
                return dict(r) if r else None

            async def list(self, limit: int = 50, offset: int = 0):
                s = self.Session()
                rows = s.execute(conversations_table.select().limit(limit).offset(offset)).fetchall()
                s.close()
                return [dict(r) for r in rows]

            async def touch(self, conversation_id: str):
                pass

        class SQLMessageRepo:
            def __init__(self):
                self.Session = Session

            async def create(self, message_id: str, conversation_id: str, role: str, content: str):
                s = self.Session()
                s.execute(messages_table.insert().values(id=message_id, conversation_id=conversation_id, role=role, content=content))
                s.commit()
                s.close()

            async def list_for_conversation(self, conversation_id: str):
                s = self.Session()
                rows = s.execute(messages_table.select().where(messages_table.c.conversation_id == conversation_id)).fetchall()
                s.close()
                return [dict(r) for r in rows]

        return SQLConversationRepo(), SQLMessageRepo()
    except Exception:
        return None, None
