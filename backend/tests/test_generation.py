"""Tests for generation pipeline and response building."""


from app.generation import GeneratedResponse
from app.retrieval import RetrievalResult


class TestGeneratedResponse:
    def test_default_fields(self):
        resp = GeneratedResponse(
            answer="test answer",
            confidence_score=0.9,
            sources_used=[],
            retrieved_documents=[],
            model="llama3.2",
        )
        assert resp.answer == "test answer"
        assert resp.confidence_score == 0.9
        assert resp.related_documents == []
        assert resp.related_repositories == []
        assert resp.token_usage == {}

    def test_with_related_docs(self):
        resp = GeneratedResponse(
            answer="test",
            confidence_score=0.8,
            sources_used=["file1.py"],
            retrieved_documents=[{"id": "1", "score": 0.9}],
            model="llama3.2",
            related_documents=[{"id": "2", "score": 0.7}],
            related_repositories=["repo1"],
            token_usage={"total_tokens": 100},
        )
        assert len(resp.related_documents) == 1
        assert resp.related_repositories == ["repo1"]
        assert resp.token_usage["total_tokens"] == 100


class TestGenerationPipeline:
    def test_retrieval_based_repos(self):
        results = [
            RetrievalResult(id="1", content="test", score=0.9, metadata={"repository": "repo1"}),
            RetrievalResult(id="2", content="test2", score=0.8, metadata={}),
        ]
        repos = set()
        for r in results:
            repo = r.metadata.get("repository", "") or r.metadata.get("file_path", "").split("/")[0]
            if repo:
                repos.add(repo)
        assert repos == {"repo1"}
