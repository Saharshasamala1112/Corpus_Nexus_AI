# CorpusGuard AI Frontend

This frontend is the React + Vite UI for the CorpusGuard AI assistant.

## Feature Overview

The frontend implements the CorpusGuard AI assistant experience with:

- streaming chat and markdown rendering
- code block copy/snippet support
- conversation history with rename, export, and delete workflows
- regenerate and retry assistant answer actions
- responsive enterprise search layout and navigation
- backend integration handled by `frontend/src/services/assistantService.ts`

## Local Development

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open the application at `http://localhost:5173`.

## Production Build

```bash
cd frontend
npm run build
```

## Configuration

The frontend uses Vite environment variables for runtime configuration:

- `VITE_API_URL` — backend API endpoint (default: `http://127.0.0.1:8001`)
- `VITE_OLLAMA_BASE_URL` — optional Ollama endpoint for fallback behavior

## Notes

- The frontend expects the backend assistant service to be available on `http://localhost:8001` by default.
- If you change the backend URL, update `VITE_API_URL` and restart the dev server.
- For full platform setup, architecture, and deployment guidance, see the repository root `README.md`.
