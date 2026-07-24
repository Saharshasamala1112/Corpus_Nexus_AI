import re

from app.core.logging import get_logger

logger = get_logger("output_validator")

_LLM_REFUSAL_PATTERNS: list[re.Pattern] = [
    re.compile(
        r"(?i)i(?:\s+|')?m?\s+(?:sorry|unable|cannot|can'?t|not\s+able)\s+(to\s+)?(?:assist|help|answer|respond|provide|generate)"
    ),
    re.compile(r"(?i)(?:as\s+(?:an?\s+)?(?:AI|language\s+model)|I'?m?\s+(?:just\s+)?an?\s+AI)"),
    re.compile(r"(?i)i\s+(?:am\s+)?(?:not\s+)?(?:programmed|designed|trained|developed)\s+to"),
    re.compile(
        r"(?i)it\s+is\s+(?:not\s+)?(?:appropriate|ethical|legal|safe|permitted|allowed)\s+to"
    ),
    re.compile(
        r"(?i)i\s+cannot\s+(?:fulfill|comply\s+with|complete|process)\s+(?:this|that|your)\s+request"
    ),
]

_CITATION_PATTERNS: list[re.Pattern] = [
    re.compile(r"\[\d+\]"),
    re.compile(r"\(Source:\s+[^)]+\)"),
    re.compile(r"\*\*Source\s+\d+\*\*"),
    re.compile(r"\-\s+\[.*?\]\(.*?\)"),
]


def validate_output(query: str, answer: str) -> str:
    """Validate LLM output for refusal patterns and hallucination indicators."""

    if not answer or not answer.strip():
        logger.warning("Empty response generated for query: %.100s", query)
        return "I don't have enough information"

    is_refusal = any(p.search(answer) for p in _LLM_REFUSAL_PATTERNS)
    has_citations = any(p.search(answer) for p in _CITATION_PATTERNS)

    if is_refusal and not has_citations:
        logger.warning("LLM refusal detected without citations — substituting fallback")
        return "I don't have enough information"

    return answer
