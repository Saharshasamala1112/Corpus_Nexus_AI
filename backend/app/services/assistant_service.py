from typing import AsyncGenerator

from app.services.llm import build_provider_for_question, get_default_provider
from app.services.vector_store import search_docs
from app.services.prompt_builder import build_retrieval_prompt
from app.services.rag_pipeline import build_query_variants, compress_context, detect_prompt_injection, sanitize_question
from app.services.local_indexer import ingest_local


def _compute_confidence(found: bool, source_count: int, has_context: bool) -> float:
    if source_count <= 0:
        return 0.55 if has_context else 0.0
    base = 0.65 + min(source_count, 5) * 0.06
    if found:
        return min(0.98, base)
    return min(0.8, 0.55 + min(source_count, 3) * 0.05)


async def rewrite_query(question: str, history: list[dict] | None = None) -> str:
    cleaned = sanitize_question(question)
    if not history:
        return cleaned or question

    provider = get_default_provider()
    prompt = (
        "Rewrite the following user question into a standalone question. "
        "Use the conversation history to preserve meaning.\n\n"
        "Conversation history:\n"
    )
    for item in history[-5:]:
        role = item.get("role", "user")
        prompt += f"{role.capitalize()}: {item.get('content', '')}\n"
    prompt += f"\nFollow-up question:\n{cleaned}\n\nStandalone question:"

    try:
        rewritten = await provider.generate(prompt)
        return sanitize_question(rewritten.strip() or cleaned)
    except Exception:
        return cleaned or question


async def ask(question: str, history: list[dict] | None = None, context: str | None = None, top_k: int = 5) -> dict:
    cleaned = sanitize_question(question)
    if detect_prompt_injection(cleaned):
        return {
            "answer": "I can help with project, repository, documentation, and engineering questions. Please provide a safe, direct question and I will answer it using the best available project context.",
            "used_corpus": False,
            "source_count": 0,
            "confidence": 0.0,
        }

    rewritten = await rewrite_query(cleaned, history)
    query_variants = build_query_variants(rewritten)
    try:
        docs = await search_docs(rewritten, top_k=top_k)
    except Exception:
        docs = []

    if not docs:
        try:
            await ingest_local()
            docs = await search_docs(rewritten, top_k=top_k)
        except Exception:
            docs = []

    provider = build_provider_for_question(rewritten)
    used = bool(docs)
    has_context = bool(context and str(context).strip())
    try:
        if used:
            prompt = build_retrieval_prompt(rewritten, docs, history)
        else:
            prompt = build_retrieval_prompt(rewritten, [], history)
            if has_context:
                prompt += f"\n\nContext:\n{compress_context(context, 2000)}"
            prompt += "\n\nNote: No directly retrieved document evidence was found. If you can answer from general project knowledge, do so briefly and clearly label it as general knowledge."

        text = await provider.generate(prompt)
        return {
            "answer": text,
            "used_corpus": used,
            "source_count": len(docs),
            "confidence": _compute_confidence(used, len(docs), has_context),
            "query_variants": query_variants,
        }
    except Exception:
        return {"answer": "The assistant is temporarily unavailable (no local LLM).", "used_corpus": used, "source_count": len(docs), "confidence": 0.0}


async def stream(question: str, history: list[dict] | None = None, context: str | None = None, top_k: int = 5) -> AsyncGenerator[str, None]:
    cleaned = sanitize_question(question)
    if detect_prompt_injection(cleaned):
        yield "I can help with project, repository, documentation, and engineering questions. Please provide a safe, direct question and I will answer it using the best available project context."
        return

    rewritten = await rewrite_query(cleaned, history)
    try:
        docs = await search_docs(rewritten, top_k=top_k)
    except Exception:
        docs = []

    if not docs:
        try:
            await ingest_local()
            docs = await search_docs(rewritten, top_k=top_k)
        except Exception:
            docs = []

    provider = build_provider_for_question(rewritten)
    try:
        if docs:
            prompt = build_retrieval_prompt(rewritten, docs, history)
        else:
            prompt = build_retrieval_prompt(rewritten, [], history)
            prompt += f"\n\nContext:\n{compress_context(context or 'No corpus context was found.', 2000)}"
            prompt += "\n\nNote: No directly retrieved document evidence was found. If you can answer from general project knowledge, do so briefly and clearly label it as general knowledge."

        async for chunk in provider.stream(prompt):
            yield chunk
    except Exception:
        result = await ask(cleaned, history, context, top_k=top_k)
        yield result.get("answer")
