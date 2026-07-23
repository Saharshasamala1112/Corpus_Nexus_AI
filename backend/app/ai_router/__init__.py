import re
from dataclasses import dataclass
from enum import StrEnum

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("ai_router")


class RoutingMode(StrEnum):
    RAG = "rag"
    HYBRID = "hybrid"
    GENERAL = "general"


@dataclass
class RouterDecision:
    mode: RoutingMode
    confidence: float
    max_score: float
    avg_score: float
    document_count: int
    has_relevant_docs: bool
    intent: str = ""
    bypass_reason: str = ""


_GREETING_PATTERNS: list[re.Pattern] = [
    re.compile(r"^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))[\s!.,]*$", re.I),
    re.compile(r"^(how\s+(are\s+you|is\s+it\s+going|do\s+you\s+do))[\s!?]*$", re.I),
    re.compile(r"^(what'?s?\s+up|sup|yo|hey\s+there)[\s!?]*$", re.I),
    re.compile(r"^(who\s+are\s+you|what\s+are\s+you|introduce\s+yourself)[\s!?]*$", re.I),
]

_GENERAL_TOPIC_KEYWORDS: list[str] = [
    "python", "javascript", "typescript", "react", "angular", "vue",
    "docker", "kubernetes", "k8s", "aws", "azure", "gcp",
    "api", "rest", "graphql", "microservices", "architecture",
    "algorithm", "data structure", "design pattern", "oop", "functional programming",
    "sql", "nosql", "mongodb", "postgresql", "redis", "mysql",
    "git", "ci/cd", "devops", "ml", "machine learning", "deep learning",
    "ai", "llm", "rag", "vector database", "embedding",
    "linux", "bash", "shell", "command line", "terminal",
    "testing", "unit test", "integration test", "tdd",
    "performance", "optimization", "scalability",
    "difference between", "what is", "how to", "tutorial",
    "best practice", "example", "vs ",
]

_PROJECT_SPECIFIC_PATTERNS: list[re.Pattern] = [
    re.compile(r"\.(py|ts|tsx|js|jsx|yaml|yml|json|md|toml|cfg|ini)$"),
    re.compile(r"(corpus|nexus|corpusguard|corpus_nexus)", re.I),
    re.compile(r"(file_path|filepath|filename|metadata|embedding|chunk)", re.I),
    re.compile(r"(backend|frontend|app/|src/|api/v)", re.I),
]


class IntentDetector:
    def detect(self, query: str) -> str:
        q = query.strip().lower()

        for pat in _GREETING_PATTERNS:
            if pat.match(q):
                return "greeting"

        if any(pat.search(q) for pat in _PROJECT_SPECIFIC_PATTERNS):
            return "project_specific"

        if any(kw in q for kw in _GENERAL_TOPIC_KEYWORDS):
            return "general_technical"

        return "unknown"


_GREETING_RESPONSE = (
    "Hello! I'm CorpusGuard AI Assistant. I can help you with:\n\n"
    "1. **Codebase understanding** — explain architecture, find implementations, trace flows\n"
    "2. **Technical questions** — programming concepts, design patterns, best practices\n"
    "3. **Project documentation** — navigate docs, understand configurations\n\n"
    "What would you like to know?"
)


def get_greeting_response() -> str:
    return _GREETING_RESPONSE


class ConfidenceRouter:
    def __init__(
        self,
        rag_threshold: float = 0.75,
        hybrid_threshold: float = 0.40,
    ):
        self.rag_threshold = rag_threshold
        self.hybrid_threshold = hybrid_threshold

    def decide(
        self,
        max_score: float,
        avg_score: float,
        document_count: int,
        has_relevant_docs: bool,
        intent: str,
    ) -> RouterDecision:
        if not has_relevant_docs or document_count == 0:
            return RouterDecision(
                mode=RoutingMode.GENERAL,
                confidence=0.0,
                max_score=max_score,
                avg_score=avg_score,
                document_count=document_count,
                has_relevant_docs=has_relevant_docs,
                intent=intent,
                bypass_reason="no_relevant_docs",
            )

        if max_score >= self.rag_threshold:
            mode = RoutingMode.RAG
            confidence = min(max_score * 100, 100.0)
            bypass_reason = f"max_score={max_score:.4f} >= rag_threshold={self.rag_threshold}"
        elif max_score >= self.hybrid_threshold:
            mode = RoutingMode.HYBRID
            confidence = (max_score / self.rag_threshold) * 75.0
            bypass_reason = (
                f"max_score={max_score:.4f} >= hybrid_threshold={self.hybrid_threshold}"
            )
        else:
            mode = RoutingMode.GENERAL
            confidence = (max_score / self.hybrid_threshold) * 40.0 if self.hybrid_threshold > 0 else 0.0
            bypass_reason = f"max_score={max_score:.4f} < hybrid_threshold={self.hybrid_threshold}"

        logger.info(
            "Router decision: mode=%s confidence=%.2f max_score=%.4f intent=%s reason=%s",
            mode.value, confidence, max_score, intent, bypass_reason,
        )

        return RouterDecision(
            mode=mode,
            confidence=round(confidence, 2),
            max_score=max_score,
            avg_score=avg_score,
            document_count=document_count,
            has_relevant_docs=has_relevant_docs,
            intent=intent,
            bypass_reason=bypass_reason,
        )


class AIRouter:
    def __init__(self):
        settings = get_settings()
        self.enabled = settings.AI_ROUTER_ENABLED
        self.general_enabled = settings.GENERAL_AI_ENABLED
        self.intent_detector = IntentDetector()
        self.confidence_router = ConfidenceRouter(
            rag_threshold=settings.RAG_CONFIDENCE_THRESHOLD,
            hybrid_threshold=settings.HYBRID_CONFIDENCE_THRESHOLD,
        )

    async def route(
        self,
        query: str,
        max_score: float,
        avg_score: float,
        document_count: int,
        has_relevant_docs: bool,
    ) -> RouterDecision:
        if not self.enabled:
            return RouterDecision(
                mode=RoutingMode.RAG,
                confidence=0.0,
                max_score=max_score,
                avg_score=avg_score,
                document_count=document_count,
                has_relevant_docs=has_relevant_docs,
                bypass_reason="ai_router_disabled",
            )

        intent = self.intent_detector.detect(query)

        if intent == "greeting":
            return RouterDecision(
                mode=RoutingMode.GENERAL,
                confidence=100.0,
                max_score=max_score,
                avg_score=avg_score,
                document_count=document_count,
                has_relevant_docs=has_relevant_docs,
                intent=intent,
                bypass_reason="greeting_detected",
            )

        if not self.general_enabled and (max_score < self.confidence_router.hybrid_threshold or document_count == 0):
            return RouterDecision(
                mode=RoutingMode.RAG,
                confidence=0.0,
                max_score=max_score,
                avg_score=avg_score,
                document_count=document_count,
                has_relevant_docs=has_relevant_docs,
                intent=intent,
                bypass_reason="general_ai_disabled",
            )

        return self.confidence_router.decide(
            max_score=max_score,
            avg_score=avg_score,
            document_count=document_count,
            has_relevant_docs=has_relevant_docs,
            intent=intent,
        )


_router: AIRouter | None = None


def get_ai_router() -> AIRouter:
    global _router
    if _router is None:
        _router = AIRouter()
    return _router
