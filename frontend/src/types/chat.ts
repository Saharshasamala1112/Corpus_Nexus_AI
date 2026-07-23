export type MessageRole = 'user' | 'assistant' | 'system'

export interface SourceReference {
  file_path: string
  file_name: string
  section?: string
  score?: number
}

export interface RetrievedDocument {
  id: string
  file_path: string
  filename: string
  score: number
  document_type: string
  language: string
  chunk_index: number
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  isStreaming?: boolean
  confidence_score?: number
  sources_used?: string[]
  retrieved_documents?: RetrievedDocument[]
  reasoning_steps?: ReasoningStep[]
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  model: string
}

export interface ContextDocument {
  id: string
  title: string
  type: 'document' | 'project' | 'repository' | 'api' | 'database' | 'docker' | 'architecture'
  source: string
  snippet?: string
  score?: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

// ---------------------------------------------------------------------------
// API types
// ---------------------------------------------------------------------------

export interface ChatRequest {
  message: string
  conversation_id?: string
  model?: string
}

export interface ChatResponse {
  message: {
    role: string
    content: string
  }
  conversation_id: string
  model: string
  confidence_score: number
  sources_used: string[]
  retrieved_documents: RetrievedDocument[]
  related_documents?: RetrievedDocument[]
  related_repositories?: string[]
  token_usage?: Record<string, number>
  follow_up_questions?: string[]
}

export interface AgentRequest {
  message: string
  conversation_id?: string
  model?: string
  max_tool_calls?: number
}

export interface ReasoningStep {
  step: number
  thought: string
  action: string
  tool_used?: string
  observation?: string
}

export interface ToolCall {
  tool: string
  reasoning: string
  parameters: Record<string, unknown>
  result: Record<string, unknown>
  execution_time_ms: number
  success: boolean
  error?: string
}

export interface AgentResponse {
  answer: string
  conversation_id: string
  reasoning_steps: ReasoningStep[]
  tools_used: string[]
  sources: SourceReference[]
  confidence_score: number
  model: string
  timestamp: string
  tool_calls: ToolCall[]
}

export interface HealthResponse {
  status: string
  version: string
  service: string
}

export interface IndexRequest {
  repository_path: string
  repository_name: string
  extensions?: string[]
}

export interface IndexResponse {
  repository: string
  files_indexed: number
  total_chunks: number
}

export interface SearchRequest {
  query: string
  top_k?: number
  repository?: string
}

export interface SearchResultItem {
  id: string
  content: string
  score: number
  metadata: Record<string, unknown>
}

export interface SearchResponse {
  query: string
  results: SearchResultItem[]
  total: number
}

export interface KnowledgeStatusResponse {
  total_documents: number
  total_chunks: number
  by_type: Record<string, number>
  by_language: Record<string, number>
}

export interface ConversationCreate {
  title: string
  model?: string
}

export interface ConversationItem {
  id: string
  title: string
  model: string
  message_count: number
  created_at: string
  updated_at: string
}

export interface ConversationListResponse {
  conversations: ConversationItem[]
  total: number
}

export interface ConversationResponse {
  id: string
  title: string
  model: string
  message_count: number
  created_at: string
  updated_at: string
}

export interface SuggestionItem {
  id: string
  text: string
  category: string
}

export interface SuggestionsResponse {
  suggestions: SuggestionItem[]
}
