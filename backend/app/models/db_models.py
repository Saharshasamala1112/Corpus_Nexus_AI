from __future__ import annotations
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
import uuid

Base = declarative_base()


class Conversation(Base):
    __tablename__ = 'conversations'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255))
    model = Column(String(128), nullable=True)
    created_at = Column(DateTime, server_default=func.now())


class Message(Base):
    __tablename__ = 'messages'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, nullable=False)
    role = Column(String(32), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class Document(Base):
    __tablename__ = 'documents'
    id = Column(String, primary_key=True)
    title = Column(String(255))
    content = Column(Text)
    source = Column(String(255))
    embedding = Column(Vector(1536))
    created_at = Column(DateTime, server_default=func.now())
