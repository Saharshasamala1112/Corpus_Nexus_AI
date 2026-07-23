# CorpusGuard AI — Frontend

React + TypeScript frontend for the CorpusGuard AI Assistant. Provides the chat UI, context panels, agent tools, and knowledge management interface.

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` and proxies API calls to the backend at `http://localhost:8001`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck and build for production |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run Vitest tests |

## Environment

Copy `.env.example` to `.env` and configure:

- `VITE_API_BASE_URL` — Backend API URL (default: `http://localhost:8001/api/v1`)
- `VITE_OLLAMA_BASE_URL` — Ollama URL for health checks (default: `http://localhost:11434`)
- `VITE_APP_NAME` — Application display name

## Docker

```bash
docker compose up --build
```

This starts the frontend (nginx on port 80), backend (FastAPI on port 8001), Redis, and Ollama.

## Project Structure

```
src/
├── components/ai-assistant/   # Chat, context panel, sidebar, tool panels
├── pages/ai-assistant/        # Main AI assistant page
├── services/api.ts            # API client
├── store/                     # Zustand state stores
├── types/chat.ts              # TypeScript definitions
└── config/env.ts              # Environment configuration
```
