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
