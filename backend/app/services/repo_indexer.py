from __future__ import annotations
import os
from typing import List

from app.services.vector_store import vector_store

IGNORE_DIRS = frozenset({
    "node_modules", ".git", "build", "dist", "venv", ".venv",
    "__pycache__", ".next", ".turbo", "coverage", ".pytest_cache",
    "target", "bin", "obj", ".tox", "egg-info",
})

EXTENSIONS = frozenset({
    ".md", ".mdx", ".txt", ".rst",
    ".py", ".java", ".js", ".ts", ".jsx", ".tsx",
    ".yml", ".yaml", ".json",
})

NAMED_FILES = frozenset({
    "Dockerfile",
    "docker-compose.yml", "docker-compose.yaml",
    "Makefile", "Makefile.am", "Makefile.in",
    ".env.example", ".gitignore",
})

MAX_FILE_CHARS = 50_000


def _should_ignore_dir(dir_name: str) -> bool:
    return dir_name in IGNORE_DIRS or dir_name.startswith(".")


def _is_target_file(filename: str) -> bool:
    if filename in NAMED_FILES:
        return True
    _, ext = os.path.splitext(filename)
    return ext.lower() in EXTENSIONS


def _collect_files(base_path: str) -> List[str]:
    out: List[str] = []
    base = os.path.abspath(base_path)
    if not os.path.isdir(base):
        return out
    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if not _should_ignore_dir(d)]
        for f in files:
            if _is_target_file(f):
                out.append(os.path.join(root, f))
    return out


def _read_file(path: str) -> str | None:
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    except Exception:
        return None


def _chunk_text(text: str, chunk_size: int = 2000, overlap: int = 200) -> List[str]:
    if len(text) <= chunk_size:
        return [text]
    chunks: List[str] = []
    i = 0
    n = len(text)
    while i < n:
        chunks.append(text[i : i + chunk_size])
        i += chunk_size - overlap
    return chunks


async def index_repository(repo_path: str) -> int:
    files = _collect_files(repo_path)
    if not files:
        return 0

    repo_name = os.path.basename(os.path.abspath(repo_path))
    count = 0

    for fp in files:
        text = _read_file(fp)
        if not text:
            continue

        rel = os.path.relpath(fp, repo_path)
        ext = os.path.splitext(fp)[1].lower()
        file_label = os.path.basename(fp)
        doc_type = "code" if ext in {".py", ".java", ".js", ".ts", ".jsx", ".tsx", ".yml", ".yaml", ".json"} else "doc"

        if len(text) > MAX_FILE_CHARS:
            text = text[:MAX_FILE_CHARS] + "\n... (truncated)"

        chunks = _chunk_text(text)
        for idx, chunk in enumerate(chunks):
            doc_id = f"repo:{repo_name}:{rel}#{idx}"
            await vector_store.upsert(
                doc_id,
                chunk,
                metadata={
                    "repo": repo_name,
                    "path": rel,
                    "file": file_label,
                    "type": doc_type,
                    "extension": ext,
                },
            )
            count += 1

    return count


async def index_all_repos(repo_paths: List[str] | None = None) -> int:
    if repo_paths is None:
        raw = os.environ.get("REPO_PATHS", "")
        repo_paths = [p.strip() for p in raw.split(",") if p.strip()]

    if not repo_paths:
        project_root = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "..")
        )
        return await index_repository(project_root)

    total = 0
    for path in repo_paths:
        expanded = os.path.abspath(os.path.expanduser(path))
        count = await index_repository(expanded)
        total += count
    return total
