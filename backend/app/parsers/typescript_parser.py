import re

from app.parsers.base import BaseParser, ParsedDocument


class TypeScriptParser(BaseParser):
    _FUNC_PATTERN = re.compile(
        r"(?:export\s+)?(?:async\s+)?function\s+(\w+)",
        re.MULTILINE,
    )
    _CLASS_PATTERN = re.compile(
        r"(?:export\s+)?(?:abstract\s+)?class\s+(\w+)",
        re.MULTILINE,
    )
    _INTERFACE_PATTERN = re.compile(
        r"(?:export\s+)?interface\s+(\w+)",
        re.MULTILINE,
    )
    _TYPE_PATTERN = re.compile(
        r"(?:export\s+)?type\s+(\w+)",
        re.MULTILINE,
    )
    _IMPORT_PATTERN = re.compile(
        r"^import\s+.*?from\s+['\"].*?['\"]",
        re.MULTILINE,
    )

    def parse(self, file_path: str) -> ParsedDocument:
        content = self._read_file(file_path)
        extracted = self._extract_typescript(content)
        metadata = self._build_metadata(file_path, {
            "document_type": "source_code",
            "language": "typescript",
        })
        return ParsedDocument(content=extracted, metadata=metadata)

    def _extract_typescript(self, content: str) -> str:
        parts: list[str] = []

        imports = self._IMPORT_PATTERN.findall(content)
        if imports:
            parts.append("Imports:\n" + "\n".join(imports))

        for m in self._INTERFACE_PATTERN.finditer(content):
            parts.append(f"interface {m.group(1)}")

        for m in self._TYPE_PATTERN.finditer(content):
            parts.append(f"type {m.group(1)}")

        for m in self._CLASS_PATTERN.finditer(content):
            parts.append(f"class {m.group(1)}")

        for m in self._FUNC_PATTERN.finditer(content):
            parts.append(f"function {m.group(1)}()")

        if not parts:
            lines = [l for l in content.split("\n") if l.strip() and not l.strip().startswith("//")]
            parts = [" ".join(lines[:50])]

        return "\n".join(parts)
