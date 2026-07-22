import type {
  ChatRequest,
  ChatResponse,
  AgentRequest,
  AgentResponse,
  IndexRequest,
  IndexResponse,
  SearchRequest,
  SearchResponse,
  HealthResponse,
  KnowledgeStatusResponse,
  ConversationListResponse,
  ConversationCreate,
  ConversationResponse,
  SuggestionsResponse,
} from '@/types/chat'
import client, { API_BASE } from '@/lib/axios'

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export async function getAssistantHealth(): Promise<HealthResponse> {
  const { data } = await client.get('/assistant/health')
  return data
}

export async function getAgentHealth(): Promise<HealthResponse> {
  const { data } = await client.get('/agent/health')
  return data
}

// ---------------------------------------------------------------------------
// Chat (RAG Assistant)
// ---------------------------------------------------------------------------

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const { data } = await client.post('/assistant/chat', request)
  return data
}

export async function* streamChatMessage(
  request: ChatRequest,
  signal?: AbortSignal
): AsyncGenerator<Record<string, unknown>, void, unknown> {
  const response = await fetch(`${API_BASE}/assistant/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Stream request failed: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') return
        try {
          yield JSON.parse(data)
        } catch {
          // skip malformed JSON
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

export async function listConversations(limit = 50, offset = 0): Promise<ConversationListResponse> {
  const { data } = await client.get('/assistant/conversations', {
    params: { limit, offset },
  })
  return data
}

export async function createConversation(
  request: ConversationCreate
): Promise<ConversationResponse> {
  const { data } = await client.post('/assistant/conversations', request)
  return data
}

export async function deleteConversation(conversationId: string): Promise<void> {
  await client.delete(`/assistant/conversations/${conversationId}`)
}

export async function getSuggestions(): Promise<SuggestionsResponse> {
  const { data } = await client.get('/assistant/suggestions')
  return data
}

// ---------------------------------------------------------------------------
// Agent Chat
// ---------------------------------------------------------------------------

export async function sendAgentMessage(request: AgentRequest): Promise<AgentResponse> {
  const { data } = await client.post('/agent/chat', request)
  return data
}

export async function listAgentTools(): Promise<{
  tools: Array<{ name: string; description: string; examples: string[] }>
}> {
  const { data } = await client.get('/agent/tools')
  return data
}

// ---------------------------------------------------------------------------
// Knowledge / Indexing
// ---------------------------------------------------------------------------

export async function indexRepository(request: IndexRequest): Promise<IndexResponse> {
  const { data } = await client.post('/knowledge/index', request)
  return data
}

export async function reindexRepository(request: IndexRequest): Promise<IndexResponse> {
  const { data } = await client.post('/knowledge/reindex', request)
  return data
}

export async function searchKnowledge(request: SearchRequest): Promise<SearchResponse> {
  const { data } = await client.post('/knowledge/search', request)
  return data
}

export async function getKnowledgeStatus(): Promise<KnowledgeStatusResponse> {
  const { data } = await client.get('/knowledge/status')
  return data
}

// ---------------------------------------------------------------------------
// Explorer compatibility helpers
// ---------------------------------------------------------------------------

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function apiFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    } as HeadersInit,
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('phone')
    window.location.href = '/login'
    return Promise.reject(new Error('Unauthorized'))
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error((data as { detail?: string }).detail || 'API Error')
  }

  return data as T
}

export async function getProfile(): Promise<unknown> {
  return apiFetch(`${API_URL}/profile`)
}

export async function searchRecords(query: string): Promise<unknown[]> {
  return apiFetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
}

export async function getLanguages(): Promise<unknown[]> {
  return apiFetch(`${API_URL}/languages`)
}

export async function getCategories(): Promise<unknown[]> {
  return apiFetch(`${API_URL}/categories`)
}

export async function getRecords(): Promise<unknown[]> {
  return apiFetch(`${API_URL}/records`)
}

export async function getRecord(id: string): Promise<unknown> {
  return apiFetch(`${API_URL}/records/${id}`)
}

export async function askAssistant(record: unknown, question: string): Promise<unknown> {
  return apiFetch(`${API_URL}/assistant/ask`, {
    method: 'POST',
    body: JSON.stringify({ record, question }),
  })
}
