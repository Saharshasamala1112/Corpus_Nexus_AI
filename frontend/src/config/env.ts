export const ENV = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  VITE_OLLAMA_BASE_URL: import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'CorpusGuard AI',
} as const
