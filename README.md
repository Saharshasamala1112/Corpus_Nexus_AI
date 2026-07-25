# CorpusGuard AI

CorpusGuard AI is the enterprise-class AI platform for the Swecha ecosystem. It delivers the CorpusGuard assistant as a unified, repository-aware intelligence layer for documentation, code, architecture, deployment, and engineering workflows.

## Feature Summary

This feature adds a complete enterprise assistant experience to the existing repository:

- **CorpusGuard AI assistant** for technical and project-level queries.
- **Hybrid retrieval** with BM25 relevance, query rewriting, metadata filters, and local corpus indexing.
- **Ollama-backed model routing** for deployment, code, architecture, and general reasoning queries.
- **Streaming enterprise UI** with markdown rendering, code copying, conversation history, regenerate, rename, export, and delete.
- **Local document ingestion** into in-memory or PGVector storage for repository-specific context.

## Architecture

- `backend/`: FastAPI assistant backend, retrieval services, local ingestion, conversation persistence, and optional background sync.
- `frontend/`: React + Vite enterprise assistant UI.
- `docs/`: supporting architecture and deployment documentation.

## Quick Start

### Backend

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open the UI at `http://localhost:5173`.

## Configuration

Environment variables:

- `VITE_API_URL`: backend API endpoint (default `http://127.0.0.1:8001`)
- `VITE_OLLAMA_BASE_URL`: optional Ollama URL for fallback support
- `DATABASE_URL`: optional PostgreSQL URL for vector storage
- `ENABLE_CORPUS_SYNC`: `true` to enable periodic corpus sync
- `ENABLE_EMBEDDING_WORKER`: `true` to enable background embedding processing

## Documentation

- [Architecture](docs/ai-platform/architecture.md)
- [Deployment Guide](docs/ai-platform/deployment-guide.md)

## Notes

- The assistant is designed to start quickly and ingest local corpus data asynchronously.
- When corpus evidence is unavailable, the assistant will still provide a concise, clearly labeled general knowledge answer.
