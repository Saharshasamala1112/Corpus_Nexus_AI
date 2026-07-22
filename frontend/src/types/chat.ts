export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  isStreaming?: boolean
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
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}
