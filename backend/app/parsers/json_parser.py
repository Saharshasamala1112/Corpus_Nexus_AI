import json

from app.parsers.base import BaseParser, ParsedDocument


class JsonParser(BaseParser):
    def parse(self, file_path: str) -> ParsedDocument:
        content = self._read_file(file_path)
        metadata = self._build_metadata(
            file_path,
            {
                "document_type": "configuration",
                "language": "json",
            },
        )

        try:
            data = json.loads(content)
            if isinstance(data, dict):
                text = self._dict_to_text(data)
            elif isinstance(data, list):
                text = json.dumps(data[:5], indent=2)
            else:
                text = content
        except json.JSONDecodeError:
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
