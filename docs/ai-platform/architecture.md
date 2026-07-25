# CorpusGuard AI Enterprise Architecture

## Overview
CorpusGuard AI now serves as the enterprise assistant layer for the Swecha ecosystem. It combines a FastAPI backend, a retrieval pipeline, an Ollama-backed LLM interface, and a premium React assistant panel.

## Components
- Backend API: FastAPI endpoints under backend/app/api/assistant.py
- Retrieval: backend/app/services/vector_store.py and backend/app/services/rag_pipeline.py
- LLM routing: backend/app/services/llm.py
- Prompting: backend/app/services/prompt_builder.py
- Frontend panel: frontend/src/components/aiAssistant

## Runtime Flow
1. User submits a question through the assistant panel.
2. The backend sanitizes and rewrites the question.
3. The retrieval pipeline runs hybrid search over indexed documents.
4. The model router selects an Ollama model based on the question intent.
5. The prompt builder assembles a grounded prompt and the response is streamed back to the UI.

## Operational Notes
- Configure OLLAMA_BASE_URL and OLLAMA_MODEL for the deployment environment.
- Enable background sync through the existing corpus and embedding workers.
- Use the assistant conversation endpoints for multi-session persistence.
