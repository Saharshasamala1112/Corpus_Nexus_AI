import re

from app.parsers.base import BaseParser, ParsedDocument


class MarkdownParser(BaseParser):
    def parse(self, file_path: str) -> ParsedDocument:
        content = self._read_file(file_path)
        sections = self._split_sections(content)
        combined = "\n\n".join(
            f"## {title}\n{body}" if title else body
            for title, body in sections
        )
        metadata = self._build_metadata(file_path, {
            "document_type": "markdown",
            "language": "markdown",
            "section_count": len(sections),
        })
        return ParsedDocument(content=combined, metadata=metadata)

    def _split_sections(self, content: str) -> list[tuple[str, str]]:
        heading_pattern = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)
        headings = list(heading_pattern.finditer(content))
        if not headings:
            return [("", content)]

        sections: list[tuple[str, str]] = []
        preamble = content[: headings[0].start()].strip()
        if preamble:
            sections.append(("", preamble))

        for i, match in enumerate(headings):
            title = match.group(2).strip()
            start = match.end()
            end = headings[i + 1].start() if i + 1 < len(headings) else len(content)
            body = content[start:end].strip()
            sections.append((title, body))

        return sections
