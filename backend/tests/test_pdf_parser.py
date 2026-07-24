"""Tests for PDF parser."""

from pathlib import Path

import pytest

from app.parsers.pdf_parser import PDFParser


class TestPDFParser:
    def setup_method(self):
        self.parser = PDFParser()

    def test_file_not_found(self):
        with pytest.raises(FileNotFoundError):
            self.parser.parse("/nonexistent/file.pdf")

    def test_metadata_attributes(self):
        doc = self.parser._build_metadata(
            "/tmp/test.py",
            {"document_type": "python", "language": "python"},
        )
        assert "file_path" in doc
        assert "document_type" in doc
        assert "file_extension" in doc

    def test_fallback_no_binary(self):
        tmp = Path("/tmp/test_fallback.txt")
        tmp.write_text("Hello world\nThis is text\n")
        meta = {"file_path": str(tmp), "document_type": "txt", "language": "text"}
        result = self.parser._fallback_parse(tmp, meta)
        assert "Hello world" in result.content
        tmp.unlink(missing_ok=True)

    def test_fallback_binary_pdf(self):
        tmp = Path("/tmp/test_binary.pdf")
        tmp.write_bytes(b"%PDF-1.4\x00\xff\xfe\x00Hello\x00World")
        meta = {"file_path": str(tmp), "document_type": "pdf", "language": "text"}
        result = self.parser._fallback_parse(tmp, meta)
        assert "Hello" in result.content or "[PDF document:" in result.content
        tmp.unlink(missing_ok=True)
