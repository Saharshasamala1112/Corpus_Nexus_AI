# Deployment Guide

## Backend
1. Create and activate the virtual environment in backend.
2. Install dependencies from backend/requirements.txt.
3. Set environment variables:
   - OLLAMA_BASE_URL=http://localhost:11434
   - OLLAMA_MODEL=llama3.2
   - LLM_PROVIDER=ollama
   - ENABLE_CORPUS_SYNC=true
   - ENABLE_EMBEDDING_WORKER=true
4. Run the FastAPI app with uvicorn app.main:app.

## Frontend
1. Install dependencies in frontend with npm install.
2. Set VITE_API_URL to the backend origin.
3. Build with npm run build.
4. Deploy the build output to the chosen static hosting or reverse proxy.

## Production Recommendations
- Place the backend behind a reverse proxy with TLS.
- Add authentication and rate limiting for public deployments.
- Keep Ollama on a dedicated host or container for predictable throughput.
- Monitor indexing and assistant latency for ongoing tuning.
