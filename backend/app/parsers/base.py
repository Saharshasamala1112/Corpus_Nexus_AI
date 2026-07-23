from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class ParsedDocument:
    content: str
    metadata: dict = field(default_factory=dict)


class BaseParser(ABC):
    @abstractmethod
    def parse(self, file_path: str) -> ParsedDocument: ...

    def _read_file(self, file_path: str) -> str:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        return path.read_text(encoding="utf-8", errors="replace")

    def _build_metadata(self, file_path: str, extra: dict | None = None) -> dict:
        path = Path(file_path)
        meta = {
            "file_path": str(path),
            "filename": path.name,
            "file_extension": path.suffix.lower(),
            "file_size_bytes": path.stat().st_size if path.exists() else 0,
        }
        if extra:
            meta.update(extra)
        return meta
