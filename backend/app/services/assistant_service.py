from typing import AsyncGenerator

from app.services.llm import get_default_provider
from app.services.vector_store import search_docs
from app.services.prompt_builder import build_retrieval_prompt


def _compute_confidence(found: bool, source_count: int) -> float:
    if source_count <= 0:
        return 0.55
    return min(0.98, 0.65 + min(source_count, 5) * 0.06)


async def rewrite_query(question: str, history: list[dict] | None = None) -> str:
    if not history:
        return question

    provider = get_default_provider()
    prompt = (
        "Rewrite the following user question into a standalone question. "
        "Use the conversation history to preserve meaning.\n\n"
        "Conversation history:\n"
    )
    for item in history[-5:]:
        role = item.get("role", "user")
        prompt += f"{role.capitalize()}: {item.get('content', '')}\n"
    prompt += f"\nFollow-up question:\n{question}\n\nStandalone question:" 

    try:
        rewritten = await provider.generate(prompt)
        return rewritten.strip() or question
    except Exception:
        return question


async def ask(question: str, history: list[dict] | None = None, context: str | None = None, top_k: int = 5) -> dict:
    rewritten = await rewrite_query(question, history)
    try:
        docs = await search_docs(rewritten, top_k=top_k)
    except Exception:
        docs = []

    provider = get_default_provider()
    used = bool(docs)
    try:
        if used:
            prompt = build_retrieval_prompt(rewritten, docs, history)
        else:
            if not context:
                return {
                    "answer": "No supporting corpus evidence was found for this query. Please refine your question or provide additional documents/context so the assistant can retrieve specific records.",
                    "used_corpus": False,
                    "source_count": 0,
                    "confidence": 0.0,
                }
            prompt = build_retrieval_prompt(rewritten, [], history)
            prompt += f"\n\nContext:\n{context}"
            prompt += "\n\nNote: The query has no directly retrieved document evidence. Answer only if you can do so clearly from the provided context, and label it as general knowledge otherwise."

        text = await provider.generate(prompt)
        return {
            "answer": text,
            "used_corpus": used,
            "source_count": len(docs),
            "confidence": _compute_confidence(used, len(docs)),
        }
    except Exception:
        return {"answer": "The assistant is temporarily unavailable (no local LLM).", "used_corpus": used, "source_count": len(docs), "confidence": 0.0}


async def stream(question: str, history: list[dict] | None = None, context: str | None = None, top_k: int = 5) -> AsyncGenerator[str, None]:
    rewritten = await rewrite_query(question, history)
    try:
        docs = await search_docs(rewritten, top_k=top_k)
    except Exception:
        docs = []

    if not docs and not context:
        yield (
            "No supporting corpus evidence was found for this query. Please refine your question or provide additional documents/context so the assistant can retrieve specific records."
        )
        return

    provider = get_default_provider()
    try:
        if docs:
            prompt = build_retrieval_prompt(rewritten, docs, history)
        else:
            prompt = build_retrieval_prompt(rewritten, [], history)
            prompt += f"\n\nContext:\n{context or 'No corpus context was found.'}"

        async for chunk in provider.stream(prompt):
            yield chunk
    except Exception:
        result = await ask(question, history, context, top_k=top_k)
        yield result.get("answer")
