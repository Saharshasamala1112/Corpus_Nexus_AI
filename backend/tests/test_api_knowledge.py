"""Tests for the knowledge API endpoints."""

import pytest


@pytest.fixture
def client():
    from fastapi.testclient import TestClient

    from app.main import app

    return TestClient(app)


class TestKnowledgeStatus:
    def test_status_endpoint(self, client):
        response = client.get("/api/v1/knowledge/status")
        assert response.status_code == 200
        data = response.json()
        assert "total_documents" in data
        assert "total_chunks" in data


class TestKnowledgeIndex:
    def test_index_missing_path(self, client):
        response = client.post(
            "/api/v1/knowledge/index",
            json={"repository_path": "/nonexistent/path", "repository_name": "test"},
        )
        assert response.status_code == 404

    def test_index_hidden_directory(self, client):
        import os
        import tempfile

        with tempfile.TemporaryDirectory() as tmpdir:
            hidden = os.path.join(tmpdir, ".hidden")
            os.makedirs(hidden)
            response = client.post(
                "/api/v1/knowledge/index",
                json={"repository_path": hidden, "repository_name": "test"},
            )
            assert response.status_code == 400


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
