from pathlib import Path

from app.parsers.base import BaseParser, ParsedDocument

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore[assignment]


class YamlParser(BaseParser):
    def parse(self, file_path: str) -> ParsedDocument:
        content = self._read_file(file_path)
        metadata = self._build_metadata(file_path, {
            "document_type": "configuration",
            "language": "yaml",
        })

        if yaml is None:
            return ParsedDocument(content=content, metadata=metadata)

        try:
            docs = list(yaml.safe_load_all(content))
            if len(docs) == 1 and isinstance(docs[0], dict):
                text = self._dict_to_text(docs[0])
            elif docs:
                text = "\n---\n".join(self._dict_to_text(d) if isinstance(d, dict) else str(d) for d in docs)
            else:
                text = content
        except Exception:
            text = content

        return ParsedDocument(content=text, metadata=metadata)

    def _dict_to_text(self, d: dict, prefix: str = "") -> str:
        lines: list[str] = []
        for key, value in d.items():
            full_key = f"{prefix}{key}" if prefix else key
            if isinstance(value, dict):
                lines.append(self._dict_to_text(value, f"{full_key}."))
            elif isinstance(value, list):
                items = ", ".join(str(v) for v in value[:10])
                lines.append(f"{full_key}: [{items}]")
            else:
                lines.append(f"{full_key}: {value}")
        return "\n".join(lines)
