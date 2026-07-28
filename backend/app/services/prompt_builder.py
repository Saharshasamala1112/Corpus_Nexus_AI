from typing import List


SYSTEM_PROMPT = (
    "You are CorpusGuard AI, the enterprise Retrieval-Augmented Generation assistant for VISWAM.AI. "
    "You MUST answer ONLY using the retrieved documents provided in the context below. "
    "Cite sources as [1], [2], etc. "
    "If the retrieved documents do not contain the answer, say 'No relevant information was found in the company knowledge base.' "
    "Do NOT use your internal knowledge or general knowledge to answer. "
    "Do NOT invent or hallucinate facts. "
    "Keep responses concise, polished, and professional."
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


def build_retrieval_prompt(question: str, docs: List[dict], history: list[dict] | None = None, max_context_chars: int = 4000) -> str:
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
        source = metadata.get("source") or metadata.get("path") or metadata.get("type") or "corpus"
        parts.append(f"[{i}] Source: {source} | id={d.get('id')}\n{snippet}\n")
        total += len(snippet)
        if total >= max_context_chars:
            break

    parts.append("User Question:")
    parts.append(question)
    parts.append("Instructions:")
    parts.append(
        "Answer using ONLY the retrieved documents above. "
        "Cite sources as [1], [2], etc. "
        "If the documents do not contain the answer, say: 'No relevant information was found in the company knowledge base.' "
        "Do NOT use general knowledge or your internal training data. "
        "Do not invent or hallucinate facts."
    )
    return "\n\n".join(parts)
