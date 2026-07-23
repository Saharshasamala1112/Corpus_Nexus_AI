## Objective
- Complete 8 missing/partial feature areas for the CorpusGuard AI Assistant project (RAG pipeline, Agentic AI, Knowledge Ingestion, AI Assistant UI, Memory, Ollama integration, Streaming, Documentation, Quality improvements) without regenerating or duplicating existing code.

## Important Details
- Project is already partially implemented; only improve what exists.
- No redesigning the existing chat UI; integrate new panels into it.
- AI must never answer outside retrieved context; respond "I don't have enough information" if insufficient.
- Default LLM is Ollama (llama3.2 at http://localhost:11434).
- No paid APIs; local inference only.

## Project Structure
```
corpus-nexus-ai/
├── backend/
│   ├── app/
│   │   ├── agent/            # Agentic AI (planner, executor, 8 tools, prompt builder)
│   │   ├── api/v1/           # FastAPI routers (assistant, agent)
│   │   ├── core/             # Config, logging, exceptions
│   │   ├── database/         # SQLAlchemy session, models
│   │   ├── generation/       # GenerationPipeline
│   │   ├── llm/              # LLM providers (Ollama, Mock, base)
│   │   ├── memory/           # ConversationMemoryManager, SessionMemory
│   │   ├── parsers/          # File parsers (PDF, etc.)
│   │   ├── rag/              # Retrieval, embedding, context, citation, prompt
│   │   ├── repositories/     # DB repositories
│   │   ├── schemas/          # Pydantic schemas (chat, agent, conversation, common)
│   │   └── services/         # RAGChatService, StreamingChatService, ConversationService, AgentChatService
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/ai-assistant/  # ChatMessage, ContextPanel, Sidebar, etc.
│   │   ├── pages/ai-assistant/       # Main AI assistant page
│   │   ├── services/api.ts           # API client with streaming support
│   │   ├── store/                    # Zustand stores (chat, conversation)
│   │   ├── types/chat.ts             # TypeScript definitions
│   │   └── config/env.ts             # Environment config
│   └── .env.example
```

## Commands
- **Backend**: `uvicorn app.main:app --reload --port 8000` (from backend/)
- **Frontend**: `npm run dev` (from frontend/)
- **Lint backend**: `ruff check .` (from backend/)
- **Typecheck frontend**: `npx tsc --noEmit` (from frontend/)

## Work State
### Completed
- Inspected entire codebase (all backend modules, frontend components, services, routers, schemas).
- Created `backend/app/llm/ollama_llm.py` — Ollama LLM provider with streaming support.
- Updated `backend/app/llm/__init__.py` — defaults to Ollama provider, falls back to MockLLM.
- Updated `backend/app/core/config.py` — added `LLM_PROVIDER`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`.
- Created `backend/app/parsers/pdf_parser.py` — PDF parsing with PyMuPDF support and fallback.
- Registered PDF parser in `backend/app/parsers/__init__.py`.
- Updated `backend/requirements.txt` — added sentence-transformers, PyMuPDF.
- Created `backend/app/memory/__init__.py` — full memory system (ConversationMemoryManager, SessionMemory, context summarization, follow-up question generation).
- Created `frontend/src/services/api.ts` — full Axios API client for all endpoints.
- Updated `frontend/src/types/chat.ts` — complete type definitions including AgentResponse, ChatResponse, RetrievedDocument, SourceReference, etc.
- Updated `frontend/src/components/ai-assistant/chat/ChatMessage.tsx` — shows confidence indicator (Shield icon, color-coded), source citations collapsible panel, retrieved document badges, copy button.
- Updated `frontend/src/components/ai-assistant/context-panel/ContextPanel.tsx` — now reads real conversation data (retrieved_documents, sources_used) instead of mock data.
- Updated `frontend/src/store/useConversationStore.ts` — added `getState()` export, `updateMessageMetadata()` method.
- Updated `frontend/src/pages/ai-assistant/index.tsx` — replaced mock streaming with real `sendChatMessage()` API calls, stores full response metadata.
- Updated `backend/app/schemas/chat.py` — ChatResponse now includes `related_documents`, `related_repositories`, `token_usage`.
- Updated `backend/app/generation/__init__.py` — GenerationPipeline produces related_documents, related_repositories.
- Updated `backend/app/services/chat/__init__.py` (RAGChatService) — integrated memory manager, passes full generation metadata to ChatResponse.
- Updated `backend/app/llm/base.py` — added optional `chat_stream()` method to BaseLLM.
- Created `backend/app/services/chat_streaming.py` — SSE-based streaming chat service.
- Added `POST /assistant/chat/stream` endpoint to backend router.
- Added `streamChatMessage()` async generator to frontend API service.
- Created `frontend/src/config/env.ts` with environment defaults.
- Created `backend/.env.example` with all configuration options.

### Active
- None currently.

### Not Yet Started
- Documentation generation (API docs, architecture docs for developer onboarding).
- Final quality verification (lint backend, typecheck frontend, test).

## Next Move
1. Run `ruff check .` in backend/ to verify lint.
2. Run `npx tsc --noEmit` in frontend/ to verify types.
3. Generate documentation if needed.
