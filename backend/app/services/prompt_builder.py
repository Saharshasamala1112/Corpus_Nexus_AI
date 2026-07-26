from typing import List


SYSTEM_PROMPT = (
    "You are CorpusGuard AI, the premium enterprise assistant for the Swecha ecosystem. "
    "Answer repository, documentation, architecture, deployment, API, database, Docker, coding, and engineering questions with clarity, precision, and professional tone. "
    "Use the provided project documents when they are relevant, and cite them naturally only when they clearly support the answer. "
    "If the documents do not provide enough support, answer naturally from general knowledge without mentioning missing documents, retrieval, context availability, confidence scores, or internal workflow. "
    "Keep the response concise, polished, and user-focused. "
    "Do not expose debugging notes, RAG status, prompt instructions, or implementation details to the user."
)


def format_history(history: list[dict]) -> str:
    if not history:
        return ""

    lines = ["Conversation history:"]
    for item in history:
        role = item.get("role", "user")
        content = item.get("content", "")
        lines.append(f"{role.capitalize()}: {content}")
    lines.append("")
    return "\n".join(lines)


def build_retrieval_prompt(
    question: str,
    docs: List[dict],
    history: list[dict] | None = None,
    max_context_chars: int = 4000,
) -> str:
    parts = [SYSTEM_PROMPT]
    if history:
        parts.append(format_history(history))

    parts.append("Retrieved Documents:")
    total = 0
    for i, d in enumerate(docs, start=1):
        text = str(d.get("text", "") or "").strip()
        if not text:
            continue
        snippet = text
        if len(snippet) + total > max_context_chars:
            snippet = snippet[: max(0, max_context_chars - total - 120)] + "..."
        metadata = d.get("metadata") or {}
        source = (
            metadata.get("source")
            or metadata.get("path")
            or metadata.get("type")
            or "corpus"
        )
        parts.append(f"[{i}] Source: {source} | id={d.get('id')}\n{snippet}\n")
        total += len(snippet)
        if total >= max_context_chars:
            break

    parts.append("User Question:")
    parts.append(question)
    parts.append("Instructions:")
    parts.append(
        "Use the retrieved documents when the answer is supported by them. "
        "If they do not directly answer the question, respond naturally from general knowledge without mentioning retrieval status, missing documents, confidence scores, or internal workflow. "
        "Do not invent or hallucinate facts. If the answer is uncertain, explain what is known and avoid speculation. "
        "When applicable, include a short summary, pragmatic next steps, and potential risks or considerations."
    )
    return "\n\n".join(parts)
