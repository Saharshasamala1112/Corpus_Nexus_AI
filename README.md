# CorpusGuard AI Assistant

Enterprise AI copilot for codebase understanding with RAG, agentic AI, and streaming chat.

## Architecture

```
┌──────────────┐     ┌─────────────────────────────────────┐
│   Frontend    │     │            Backend (FastAPI)         │
│  (React/Vite) │────▶│  api/v1/  ──▶ services ──▶ llm/     │
│               │     │    │            │            │       │
│  Streaming    │     │    ├ assistant  ├ chat      ├ Ollama │
│  SSE Events   │◀────│    ├ agent      ├ streaming └ mock   │
│               │     │    └ knowledge  └ chat       │       │
└──────────────┘     │                     │        │       │
                     │              ┌──────┘        │       │
                     │              ▼                ▼       │
                     │         retrieval/       memory/      │
                     │         rag/             generation/  │
                     │         vectorstore/     prompt/      │
                     └─────────────────────────────────────┘
```

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env       # Edit if needed
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Key Features

- **RAG Chat** — answers questions from indexed codebases with source citations
- **Streaming** — real-time SSE streaming for chat responses
- **Agentic AI** — multi-tool agent (read code, search, git log, etc.)
- **Ollama** — local LLM inference (default: llama3.2)
- **Memory** — conversation summarization, follow-up questions
- **Knowledge Indexing** — index repos for semantic code search
- **Security** — JWT auth, rate limiting, prompt injection protection

## Project Structure

```
backend/app/
├── api/v1/           # FastAPI routers
│   ├── assistant/    # Chat, conversations, suggestions
│   ├── agent/        # Agentic AI endpoints
│   └── knowledge/    # Indexing and semantic search
├── core/             # Config, security, logging, exceptions
├── database/         # SQLAlchemy session, models
├── generation/       # RAG generation pipeline
├── llm/              # LLM providers (Ollama, Mock)
├── memory/           # Conversation memory, summarization
├── parsers/          # File parsers (PDF, etc.)
├── rag/              # Retrieval context, citations, prompt
├── repositories/     # DB repositories
├── retrieval/        # Semantic search + re-ranking
├── schemas/          # Pydantic request/response models
├── services/         # Chat services (RAG + streaming)
└── vectorstore/      # Vector store abstraction

frontend/src/
├── components/ai-assistant/  # Chat UI, sidebar, context panel
├── pages/ai-assistant/       # Main assistant page
├── services/api.ts           # API client with streaming
├── store/                    # Zustand stores
├── types/chat.ts             # TypeScript definitions
└── config/env.ts             # Environment config
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite+aiosqlite:///./corpusguard.db` | Database connection |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2` | Default LLM model |
| `JWT_SECRET_KEY` | `change-me-in-production` | JWT signing key |
| `RATE_LIMIT_ENABLED` | `true` | Rate limiting toggle |

## Commands

| Command | Location | Description |
|---|---|---|
| `ruff check .` | `backend/` | Lint Python |
| `npx tsc --noEmit` | `frontend/` | TypeScript typecheck |
| `npm run dev` | `frontend/` | Dev server |
| `uvicorn app.main:app --reload` | `backend/` | API server |

## Team

- Meghana Vanamoju
- Himavantha Reddy
- Ramireddy Niteesha
- Akshaya
- Saharsha
