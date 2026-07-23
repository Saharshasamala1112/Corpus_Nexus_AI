"""Tests for the assistant chat API endpoints."""

import pytest


@pytest.fixture
def client():
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as c:
        yield c


class TestAssistantHealth:
    def test_health_endpoint(self, client):
        response = client.get("/api/v1/assistant/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data


class TestChatEndpoint:
    def test_chat_empty_message(self, client):
        response = client.post(
            "/api/v1/assistant/chat",
            json={"message": "", "model": "mock"},
        )
        assert response.status_code == 422

    def test_chat_missing_message(self, client):
        response = client.post(
            "/api/v1/assistant/chat",
            json={"model": "mock"},
        )
        assert response.status_code == 422


class TestConversationsEndpoint:
    def test_list_conversations(self, client):
        response = client.get("/api/v1/assistant/conversations")
        assert response.status_code == 200
        data = response.json()
        assert "conversations" in data
        assert "total" in data

    def test_create_conversation(self, client):
        response = client.post(
            "/api/v1/assistant/conversations",
            json={"title": "Test conversation", "model": "mock"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test conversation"
