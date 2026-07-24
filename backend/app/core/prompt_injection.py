import re

from app.core.logging import get_logger

logger = get_logger("prompt_injection")

_INJECTION_PATTERNS: list[tuple[str, str]] = [
    (
        "system_override",
        r"(?i)(ignore|disregard|override)\s+(all\s+)?(previous|above|system)\s+(instructions|commands|directives)",
    ),
    (
        "role_switch",
        r"(?i)(you\s+are\s+now|from\s+now\s+on|act\s+as|pretend\s+(to\s+be|that))\s+(a\s+|an\s+)?(human|assistant\s+without|chatbot\s+without|unrestricted|unfiltered|jailbroken| DAN|GPT\s+-?\d+)",
    ),
    (
        "prompt_leak",
        r"(?i)(print|show|reveal|output|display|leak|dump)\s+(your\s+)?(system\s+)?(prompt|instructions|rules|initial|constitution)",
    ),
    (
        "delimiter_break",
        r"(?i)(ignore\s+(the\s+)?(above|previous)|forget\s+(the\s+)?(above|previous)|====+|----+|```\s*\n.*\n```)",
    ),
    (
        "token_manipulation",
        r"(?i)(repeat|loop)\s+(the\s+)?(word|phrase|token)\s+(\w+\s+){0,5}(\w+)(\s+\1){10,}",
    ),
    (
        "encoding_evasion",
        r"(?i)(base64|hex\s+encode|rot13|caesar|cipher|obfuscate|encoded\s+message)",
    ),
    (
        "recursion_attack",
        r"(?i)(tell\s+me\s+(your\s+)?(system\s+)?prompt|repeat\s+(everything|all)\s+(after|before)|say\s+(your\s+)?(init|initialization|system))",
    ),
    (
        "sql_injection",
        r"(?i)(SELECT|DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|EXEC|UNION)\s+.*\s+(FROM|INTO|TABLE|WHERE)",
    ),
    (
        "command_injection",
        r"(?i)(;|&&|\|\|)\s*(rm|wget|curl|chmod|eval|exec|system|passthru|shell_exec|popen|proc_open)\s*\(",
    ),
    (
        "model_confusion",
        r"(?i)(you\s+are\s+(not\s+)?(an\s+)?AI|cannot\s+answer|are\s+you\s+(sure|certain|confident)|i\s+don'?t\s+(think|believe)\s+you)",
    ),
    ("repetition_bomb", r"(?i)(repeat|say|write|type)\s+(\"|')(\w+\s+){50,}(\"|')"),
    (
        "xml_tag_injection",
        r"(?i)<(system|instruction|prompt|user|assistant|tool|function|context)>",
    ),
    ("markdown_injection", r"(?i)![\\[{]\s*(system|instruction|prompt)"),
    (
        "multi_lang_bypass",
        r"(?i)(answer\s+in\s+|respond\s+in\s+|speak\s+)(french|german|spanish|chinese|russian|arabic|hindi|latin|leetspeak|morse)",
    ),
    (
        "fake_history",
        r"(?i)(user\s+(said|asked|wrote):|assistant\s+(responded|replied|said):|human:)\s*.*(ignore|forget|override|system)",
    ),
    (
        "jailbreak_prefix",
        r"(?i)(DEVELOPER\s+MODE|STAN|DAN|ChatGPT\s+Jailbreak|GPT4\s+Jailbreak|Virtualization|simulate\s+unrestricted|simulate\s+unfiltered)",
    ),
]


def sanitize_query(query: str) -> str:
    matches = []
    for name, pattern in _INJECTION_PATTERNS:
        if re.search(pattern, query):
            matches.append(name)

    if matches:
        logger.warning("Prompt injection patterns detected: %s | query: %.100s", matches, query)
        match matches:
            case ["repetition_bomb"]:
                return query[:200]
            case _:
                return "I don't have enough information"

    return query
