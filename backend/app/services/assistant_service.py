import logging
import re
import traceback
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

from app.services.llm import (
    LLMProvider,
    _strip_reasoning_sections,
    build_provider_for_question,
    get_default_provider,
    get_fallback_provider,
)
from app.services.prompt_builder import build_retrieval_prompt
from app.services.rag_pipeline import (
    build_query_variants,
    compress_context,
    retrieve_context,
    build_query_variants,
    detect_prompt_injection,
    sanitize_question,
)


def _is_greeting(message: str) -> bool:
    if not message:
        return False

    normalized = re.sub(r"[^a-z0-9]+", " ", message.lower()).strip()
    greetings = {
        "hi",
        "hello",
        "hey",
        "hey there",
        "good morning",
        "good afternoon",
        "good evening",
        "greetings",
    }
    return (
        normalized in greetings
        or normalized.startswith("hello")
        or normalized.startswith("hi")
    )


def _clean_response_text(text: str) -> str:
    if not text:
        return ""

    text = _strip_reasoning_sections(text)

    patterns = [
        r"\bstreaming response\.\.\.\s*",
        r"\bsince no direct evidence\b",
        r"\bno directly retrieved document evidence\b",
        r"\breview the documentation\b",
        r"\bwithout direct evidence\b",
        r"\bconfidence\s*:\s*\d+(?:\.\d+)?\b",
        r"\bretrieval status\b",
        r"\bretrieved documents\b",
        r"\bcontext availability\b",
        r"(?im)^\s*(user|assistant|retrieved documents|answer|context)\s*:\s*",
    ]

    cleaned = text
    for pattern in patterns:
        cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)

    return cleaned
NO_INFO_MESSAGE = "No relevant information was found in the company knowledge base."


async def _generate_with_fallback(provider: LLMProvider, prompt: str) -> str:
    try:
        return _clean_response_text(await provider.generate(prompt))
    except Exception as e:
        logger.exception("Assistant request failed")
        traceback.print_exc()
        fallback = get_fallback_provider(provider)
        if fallback is provider:
            raise
        return _clean_response_text(await fallback.generate(prompt))


async def _stream_with_fallback(
    provider: LLMProvider, prompt: str
) -> AsyncGenerator[str, None]:
    try:
        async for chunk in provider.stream(prompt):
            cleaned = _clean_response_text(chunk)
            if cleaned:
                yield cleaned
        return
    except Exception as e:
        logger.exception("Assistant request failed")
        traceback.print_exc()
        fallback = get_fallback_provider(provider)
        if fallback is provider:
            raise
        text = _clean_response_text(await fallback.generate(prompt))
        if text:
            yield text


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
    except Exception as e:
        logger.exception("Assistant request failed")
        traceback.print_exc()
        return cleaned or question


async def ask(
    question: str,
    history: list[dict] | None = None,
    context: str | None = None,
    top_k: int = 5,
) -> dict:
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
    except Exception as e:
        logger.exception("Assistant request failed")
        traceback.print_exc()
        docs = await retrieve_context(rewritten, top_k=top_k)
    except Exception:
        docs = []

    if not docs:
        return {
            "answer": NO_INFO_MESSAGE,
            "used_corpus": False,
            "source_count": 0,
            "confidence": 0.0,
        }

    provider = build_provider_for_question(rewritten)
    try:
        is_initial_greeting = not history and _is_greeting(cleaned)
        if used:
            prompt = build_retrieval_prompt(rewritten, docs, history)
        else:
            prompt = build_retrieval_prompt(rewritten, [], history)
            if has_context:
                prompt += f"\n\nContext:\n{compress_context(context, 2000)}"

        if is_initial_greeting:
            prompt += "\n\nWhen the user sends a greeting such as 'hi' or 'hello', respond with a brief greeting and offer help. Do not add a greeting to other questions."

        prompt = build_retrieval_prompt(rewritten, docs, history)
        text = await _generate_with_fallback(provider, prompt)
        return {
            "answer": text,
            "used_corpus": True,
            "source_count": len(docs),
            "confidence": min(0.95, 0.5 + len(docs) * 0.08),
            "query_variants": query_variants,
        }
    except Exception as e:
        logger.exception("Assistant request failed")
        traceback.print_exc()
        return {
            "answer": "The assistant is temporarily unavailable (no local LLM).",
            "used_corpus": used,
    except Exception:
        return {
            "answer": "The assistant is temporarily unavailable.",
            "used_corpus": True,
            "source_count": len(docs),
            "confidence": 0.0,
        }


async def stream(
    question: str,
    history: list[dict] | None = None,
    context: str | None = None,
    top_k: int = 5,
) -> AsyncGenerator[str, None]:
    cleaned = sanitize_question(question)
    if detect_prompt_injection(cleaned):
        yield "I can help with project, repository, documentation, and engineering questions. Please provide a safe, direct question and I will answer it using the best available project context."
        return

    rewritten = await rewrite_query(cleaned, history)

    try:
        docs = await search_docs(rewritten, top_k=top_k)
    except Exception as e:
        logger.exception("Assistant request failed")
        traceback.print_exc()
        docs = await retrieve_context(rewritten, top_k=top_k)
    except Exception:
        docs = []

    if not docs:
        yield NO_INFO_MESSAGE
        return

    provider = build_provider_for_question(rewritten)
    try:
        is_initial_greeting = not history and _is_greeting(cleaned)
        if docs:
            prompt = build_retrieval_prompt(rewritten, docs, history)
        else:
            prompt = build_retrieval_prompt(rewritten, [], history)
            prompt += f"\n\nContext:\n{compress_context(context or 'No corpus context was found.', 2000)}"

        if is_initial_greeting:
            prompt += "\n\nWhen the user sends a greeting such as 'hi' or 'hello', respond with a brief greeting and offer help. Do not add a greeting to other questions."

        prompt = build_retrieval_prompt(rewritten, docs, history)
        async for chunk in _stream_with_fallback(provider, prompt):
            yield chunk
    except Exception as e:
        logger.exception("Assistant request failed")
        traceback.print_exc()
        result = await ask(cleaned, history, context, top_k=top_k)
        yield result.get("answer")
