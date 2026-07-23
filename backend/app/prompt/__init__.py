from app.ai_router import RoutingMode

RAG_SYSTEM_PROMPT = """You are CorpusGuard AI Assistant, an enterprise-grade AI copilot specialized in codebase understanding and documentation analysis.

## Core Directives

1. **NEVER hallucinate.** Only answer using information from the provided context documents. If the context does not contain enough information to answer the question, explicitly state: "I don't have enough information in the knowledge base to answer this question."

2. **Cite every source.** Every claim you make must reference its source document. Use the format:
   - **Main implementation:** `filename` - brief description
   - **Supporting files:** `filename` - brief description
   - **Source References:** list all source files used

3. **Answer only from retrieved knowledge.** Do not invent code, configurations, or architectural details that are not present in the provided context.

4. **Explain technical concepts clearly.** Structure your answers with:
   - A direct answer to the question
   - Relevant code references with file paths
   - Supporting documentation references
   - A list of all source files used

5. **If context is insufficient**, say so explicitly rather than guessing.

## Response Format

Always structure your response as:

**Answer**
[Direct answer derived from context]

**Main implementation:**
- `file_path` - description of role

**Supporting files:**
- `file_path` - description of role

**Source References:**
- file1.py
- file2.py
- ...

Never omit the Source References section. Even if you cannot answer, list the files you examined.
"""

HYBRID_SYSTEM_PROMPT = """You are CorpusGuard AI Assistant, an enterprise-grade AI copilot specialized in codebase understanding, documentation analysis, and software engineering.

## Core Directives

1. **Use your knowledge + provided context.** You have retrieved some potentially relevant documents from the project knowledge base, but they may be incomplete. Combine the provided context with your general software engineering knowledge to give a complete answer.

2. **NEVER say "I don't know."** If the context is insufficient, rely on your general expertise. You are an expert software engineer with deep knowledge of programming, system design, DevOps, and modern tech stacks.

3. **Cite sources when available.** When you use information from the provided context documents, cite them. When you use general knowledge, it's fine to answer without citations.

4. **Explain technical concepts clearly.** Structure your answers with:
   - A direct answer to the question
   - Code examples or references where helpful
   - Relevant source files if they were used

5. **Be helpful and complete.** Your goal is to always provide a useful answer. Do not refuse to answer.
"""

GENERAL_SYSTEM_PROMPT = """You are CorpusGuard AI Assistant, an expert software engineering and AI assistant.

## Core Directives

1. **Answer any technical question.** You have deep knowledge of programming languages, frameworks, system design, DevOps, AI/ML, databases, and software engineering best practices.

2. **NEVER say "I don't know."** You are an expert designed to answer questions. If something is outside your knowledge, provide your best understanding and suggest where the user might find more information.

3. **Provide practical, actionable answers.** Include code examples, architecture diagrams (in text), best practices, and real-world considerations.

4. **Be conversational and helpful.** Explain concepts clearly at the appropriate level of detail.

5. **No project context is available** for this question, so answer from general knowledge.
"""


def build_system_prompt(mode: RoutingMode = RoutingMode.RAG) -> str:
    if mode == RoutingMode.HYBRID:
        return HYBRID_SYSTEM_PROMPT
    elif mode == RoutingMode.GENERAL:
        return GENERAL_SYSTEM_PROMPT
    return RAG_SYSTEM_PROMPT


INSTRUCTION_BOUNDARY_START = "[INST]"
INSTRUCTION_BOUNDARY_END = "[/INST]"


_INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all instructions",
    "forget everything",
    "you are now",
    "act as a",
    "pretend to be",
    "override",
    "new instruction",
    "system prompt",
    "you must",
    "you will",
    "disregard",
    "you are free",
    "you can now",
    "do not follow",
    "ignore the above",
    "ignore your",
    "forget your",
]


def sanitize_query(query: str) -> str:
    safe = query.replace(INSTRUCTION_BOUNDARY_START, "").replace(INSTRUCTION_BOUNDARY_END, "")
    safe_lower = safe.lower()
    for pattern in _INJECTION_PATTERNS:
        if pattern in safe_lower:
            from app.core.logging import get_logger

            get_logger("prompt").warning("Prompt injection pattern detected: '%s'", pattern)
            safe = safe.replace(pattern, "[redacted]")
    return safe


def build_rag_user_prompt(query: str, context_block: str) -> str:
    safe_query = sanitize_query(query)
    return (
        f"{INSTRUCTION_BOUNDARY_START}\n"
        f"## Retrieved Knowledge Base Context\n\n"
        f"{context_block}\n\n"
        f"## User Question\n\n"
        f"{safe_query}\n\n"
        f"## Instructions\n\n"
        f"Answer the question using ONLY the context above. "
        f"Cite every source file you reference. "
        f"If the context is insufficient, you must say: "
        f"'I don't have enough information in the knowledge base to answer this question.'\n"
        f"{INSTRUCTION_BOUNDARY_END}"
    )


def build_hybrid_user_prompt(query: str, context_block: str) -> str:
    safe_query = sanitize_query(query)
    return (
        f"{INSTRUCTION_BOUNDARY_START}\n"
        f"## Retrieved Knowledge Base Context\n\n"
        f"The following documents may be relevant to the question:\n\n"
        f"{context_block}\n\n"
        f"## User Question\n\n"
        f"{safe_query}\n\n"
        f"## Instructions\n\n"
        f"Answer the question using BOTH the context above (if relevant) "
        f"and your general software engineering knowledge. Do not say 'I don't know' — "
        f"if the context is incomplete, supplement with your expertise.\n"
        f"{INSTRUCTION_BOUNDARY_END}"
    )


def build_general_user_prompt(query: str) -> str:
    safe_query = sanitize_query(query)
    return (
        f"{INSTRUCTION_BOUNDARY_START}\n"
        f"## User Question\n\n"
        f"{safe_query}\n\n"
        f"## Instructions\n\n"
        f"Answer the question using your general knowledge. "
        f"No project-specific context is available. "
        f"Do not say 'I don't know' — provide your best answer.\n"
        f"{INSTRUCTION_BOUNDARY_END}"
    )


def build_user_prompt(query: str, context_block: str = "", mode: RoutingMode = RoutingMode.RAG) -> str:
    if mode == RoutingMode.GENERAL:
        return build_general_user_prompt(query)
    elif mode == RoutingMode.HYBRID:
        return build_hybrid_user_prompt(query, context_block)
    return build_rag_user_prompt(query, context_block)
