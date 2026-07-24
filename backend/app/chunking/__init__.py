from dataclasses import dataclass, field


@dataclass
class Chunk:
    content: str
    metadata: dict = field(default_factory=dict)
    index: int = 0


class TextChunker:
    def __init__(
        self,
        chunk_size: int = 800,
        chunk_overlap: int = 150,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk(
        self,
        text: str,
        metadata: dict | None = None,
    ) -> list[Chunk]:
        if not text.strip():
            return []

        words = text.split()
        if len(words) <= self.chunk_size:
            return [
                Chunk(
                    content=text.strip(),
                    metadata=metadata or {},
                    index=0,
                )
            ]

        chunks: list[Chunk] = []
        start = 0
        idx = 0

        while start < len(words):
            end = min(start + self.chunk_size, len(words))
            chunk_words = words[start:end]
            chunk_text = " ".join(chunk_words).strip()

            if chunk_text:
                chunks.append(
                    Chunk(
                        content=chunk_text,
                        metadata=metadata or {},
                        index=idx,
                    )
                )
                idx += 1

            if end >= len(words):
                break

            start += self.chunk_size - self.chunk_overlap

        return chunks
