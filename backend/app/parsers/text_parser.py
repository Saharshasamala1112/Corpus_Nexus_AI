from app.parsers.base import BaseParser, ParsedDocument


class TextParser(BaseParser):
    def parse(self, file_path: str) -> ParsedDocument:
        content = self._read_file(file_path)
        metadata = self._build_metadata(file_path, {
            "document_type": "text",
            "language": "text",
        })
        return ParsedDocument(content=content, metadata=metadata)
