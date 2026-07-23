from pathlib import Path

from app.core.logging import get_logger
from app.parsers.base import BaseParser, ParsedDocument

logger = get_logger("parser.pdf")


class PDFParser(BaseParser):
    def parse(self, file_path: str) -> ParsedDocument:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        metadata = self._build_metadata(
            file_path,
            {"document_type": "pdf", "language": "text"},
        )

        try:
            import pymupdf
        except ImportError:
            try:
                import fitz as pymupdf
            except ImportError:
                logger.warning(
                    "PyMuPDF not installed, using fallback text extraction for %s",
                    file_path,
                )
                return self._fallback_parse(path, metadata)

        try:
            doc = pymupdf.open(file_path)
            text_parts = []
            for page_num in range(len(doc)):
                page = doc[page_num]
                text_parts.append(page.get_text())

            total_pages = len(doc)
            doc.close()
            content = "\n\n".join(text_parts)

            metadata["total_pages"] = total_pages
            metadata["file_size_bytes"] = path.stat().st_size

            return ParsedDocument(content=content, metadata=metadata)
        except Exception as e:
            logger.warning("PyMuPDF parse failed for %s: %s, using fallback", file_path, e)
            return self._fallback_parse(path, metadata)

    def _fallback_parse(self, path: Path, metadata: dict) -> ParsedDocument:
        try:
            import magic

            mime = magic.from_file(str(path), mime=True)
        except ImportError:
            mime = ""

        if mime and mime != "text/plain":
            return ParsedDocument(
                content=f"[PDF document: {path.name} — requires PyMuPDF for text extraction]",
                metadata=metadata,
            )

        text_part = self._read_file(str(path))
        content_lines = []
        for line in text_part.split("\n"):
            printable = sum(1 for c in line if 32 <= ord(c) <= 126 or c in "\t\r")
            if len(line) > 0 and printable / len(line) > 0.6 and line.strip():
                content_lines.append(line)

        content = "\n".join(content_lines) if content_lines else f"[PDF document: {path.name}]"
        metadata["document_type"] = "pdf"
        metadata["language"] = "text"
        return ParsedDocument(content=content, metadata=metadata)
