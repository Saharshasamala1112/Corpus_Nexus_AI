import re
from dataclasses import dataclass, field


@dataclass
class SourceCitation:
    filename: str
    file_path: str = ""
    section: str = ""
    relevance: str = ""


@dataclass
class CitationResult:
    main_implementation: list[SourceCitation]
    supporting_files: list[SourceCitation]
    source_references: list[str]
    raw_citations: list[SourceCitation]


_FILE_PATTERN = re.compile(
    r"`?([a-zA-Z0-9_\-/]+\.(?:py|ts|tsx|js|jsx|yaml|yml|json|md|txt|toml|cfg|ini|sh|dockerfile))`?",
    re.IGNORECASE,
)

_SECTION_PATTERN = re.compile(
    r"\*\*(Main implementation|Supporting files|Source References|Answer)[:\s]*\*\*",
    re.IGNORECASE,
)


def extract_citations(response_text: str) -> CitationResult:
    main_impl: list[SourceCitation] = []
    supporting: list[SourceCitation] = []
    source_refs: list[str] = []
    raw: list[SourceCitation] = []

    lines = response_text.split("\n")
    current_section = "unknown"

    for line in lines:
        section_match = _SECTION_PATTERN.search(line)
        if section_match:
            section_text = section_match.group(1).lower().replace(" ", "_").replace(":", "")
            if "main" in section_text:
                current_section = "main"
            elif "support" in section_text:
                current_section = "supporting"
            elif "source" in section_text or "reference" in section_text:
                current_section = "references"
            elif "answer" in section_text:
                current_section = "answer"
            continue

        if current_section == "answer":
            continue

        files = _FILE_PATTERN.findall(line)
        for f in files:
            citation = SourceCitation(
                filename=f.split("/")[-1],
                file_path=f,
                section=current_section,
            )
            raw.append(citation)

            if current_section == "main":
                main_impl.append(citation)
            elif current_section == "supporting":
                supporting.append(citation)
            elif current_section == "references":
                source_refs.append(f)

    if not source_refs:
        seen = set()
        for c in raw:
            if c.file_path not in seen:
                source_refs.append(c.file_path)
                seen.add(c.file_path)

    return CitationResult(
        main_implementation=main_impl,
        supporting_files=supporting,
        source_references=source_refs,
        raw_citations=raw,
    )


def compute_confidence(
    scores: list[float],
    has_citations: bool,
    has_context: bool,
) -> float:
    if not scores:
        return 0.0

    avg_score = sum(scores) / len(scores)
    max_score = max(scores)

    confidence = (avg_score * 0.4 + max_score * 0.4) * 100

    if has_citations:
        confidence = min(confidence + 10.0, 100.0)

    if not has_context:
        confidence = 0.0

    return round(min(confidence, 100.0), 2)
