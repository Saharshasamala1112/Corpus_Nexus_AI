"""Tests for retrieval pipeline (re-ranker, semantic search)."""

from app.retrieval import ReRanker, RetrievalResult


class TestReRanker:
    def setup_method(self):
        self.reranker = ReRanker(alpha=0.3)

    def test_empty_results(self):
        assert self.reranker.rerank("query", []) == []

    def test_single_result(self):
        results = [
            RetrievalResult(id="1", content="the user login", score=0.8, metadata={}),
        ]
        ranked = self.reranker.rerank("user login", results)
        assert len(ranked) == 1
        assert ranked[0].score > 0

    def test_reorders_by_relevance(self):
        results = [
            RetrievalResult(id="1", content="random unrelated text", score=0.9, metadata={}),
            RetrievalResult(id="2", content="user authentication login", score=0.7, metadata={}),
        ]
        ranked = self.reranker.rerank("user login", results)
        assert ranked[0].id == "2"

    def test_preserves_metadata(self):
        meta = {"file_path": "auth.py", "language": "python"}
        results = [
            RetrievalResult(id="1", content="login auth", score=0.5, metadata=meta),
        ]
        ranked = self.reranker.rerank("login", results)
        assert ranked[0].metadata == meta

    def test_scores_are_bounded(self):
        results = [
            RetrievalResult(id="1", content="a b c", score=1.0, metadata={}),
            RetrievalResult(id="2", content="x y z", score=0.1, metadata={}),
        ]
        ranked = self.reranker.rerank("query test", results)
        for r in ranked:
            assert 0.0 <= r.score <= 1.0

    def test_blended_score(self):
        results = [
            RetrievalResult(id="1", content="user login auth", score=0.5, metadata={}),
        ]
        ranked = self.reranker.rerank("user login auth", results)
        assert ranked[0].score > 0.5


class TestRetrievalResult:
    def test_dataclass_creation(self):
        r = RetrievalResult(id="1", content="test", score=0.9, metadata={"key": "val"})
        assert r.id == "1"
        assert r.content == "test"
        assert r.score == 0.9
        assert r.metadata == {"key": "val"}

    def test_default_metadata(self):
        r = RetrievalResult(id="1", content="test", score=0.9)
        assert r.metadata == {}
