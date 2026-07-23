"""Tests for the knowledge API endpoints."""

import pytest

from app.core.security import create_access_token


@pytest.fixture
def client():
    from fastapi.testclient import TestClient

    from app.main import app
    return TestClient(app)


@pytest.fixture
def auth_header():
    token = create_access_token(subject="test-user")
    return {"Authorization": f"Bearer {token}"}


class TestKnowledgeStatus:
    def test_status_endpoint(self, client):
        response = client.get("/api/v1/knowledge/status")
        assert response.status_code == 200
        data = response.json()
        assert "total_documents" in data
        assert "total_chunks" in data


class TestKnowledgeIndex:
    def test_index_missing_path(self, client, auth_header):
        response = client.post(
            "/api/v1/knowledge/index",
            json={"repository_path": "/nonexistent/path", "repository_name": "test"},
            headers=auth_header,
        )
        assert response.status_code == 404

    def test_index_hidden_directory(self, client, auth_header):
        import os
        import tempfile

        with tempfile.TemporaryDirectory() as tmpdir:
            hidden = os.path.join(tmpdir, ".hidden")
            os.makedirs(hidden)
            response = client.post(
                "/api/v1/knowledge/index",
                json={"repository_path": hidden, "repository_name": "test"},
                headers=auth_header,
            )
            assert response.status_code == 400

    def test_index_requires_auth(self, client):
        response = client.post(
            "/api/v1/knowledge/index",
            json={"repository_path": "/tmp", "repository_name": "test"},
        )
        assert response.status_code == 401


class TestKnowledgeSearch:
    def test_search_endpoint(self, client):
        response = client.post(
            "/api/v1/knowledge/search",
            json={"query": "login function", "top_k": 3},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["query"] == "login function"
        assert isinstance(data["results"], list)
