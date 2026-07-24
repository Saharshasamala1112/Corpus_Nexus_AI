from typing import List


SYSTEM_PROMPT = (
    "You are CorpusGuard AI, the enterprise assistant for the Corpus Nexus platform. "
    "You must answer questions using the most relevant documents and provide accurate citations. "
    "If the documents do not contain the answer, answer as clearly and concisely as possible from your general knowledge. "
    "Always cite sources using bracketed citation IDs like [1], [2], and include a brief confidence estimate between 0.0 and 1.0 at the end."
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
        text = d.get("text", "")
        if not text:
            continue
        snippet = text
        if len(snippet) + total > max_context_chars:
            snippet = snippet[: max(0, max_context_chars - total - 120)] + "..."
        source = d.get("metadata", {}).get("source") or d.get("metadata") or "corpus"
        parts.append(f"[{i}] Source: {source} | id={d.get('id')}\n{snippet}\n")
        total += len(snippet)
        if total >= max_context_chars:
            break

    parts.append("User Question:")
    parts.append(question)
    parts.append("Instructions:")
    parts.append(
        "Use the retrieved documents when the answer is supported by them. "
        "Cite all sources referenced as [1], [2], etc. "
        "If the requested answer cannot be derived from the retrieved documents, explicitly state that no supporting corpus evidence was found. "
        "If you still provide a general-knowledge answer, label it clearly as general knowledge and avoid presenting it as corpus-supported. "
        "Do not infer a positive or negative state from the corpus unless it is clearly supported by the documents. "
        "If there is no corpus evidence available, say so directly and keep the response concise. "
        "Finally, append a confidence score between 0.0 and 1.0 in the format Confidence: 0.85."
    )
    return "\n\n".join(parts)
