import { useCallback, useSyncExternalStore } from 'react'
import type { Conversation, Message } from '@/types/chat'

interface ConversationStore {
  conversations: Conversation[]
  activeConversationId: string | null
}

let state: ConversationStore = {
  conversations: [],
  activeConversationId: null,
}

let listeners: Array<() => void> = []

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot(): ConversationStore {
  return state
}

function setState(updater: (prev: ConversationStore) => ConversationStore) {
  state = updater(state)
  emitChange()
}

let idCounter = 100

export function getState() {
  return state
}

export function useConversationStore() {
  const store = useSyncExternalStore(subscribe, getSnapshot)

  const activeConversation = store.conversations.find((c) => c.id === store.activeConversationId)

  const createConversation = useCallback((title?: string) => {
    const id = `conv_${++idCounter}`
    const now = new Date()
    const newConv: Conversation = {
      id,
      title: title || 'New conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
      model: 'llama3.2',
    }
    setState((prev) => ({
      conversations: [newConv, ...prev.conversations],
      activeConversationId: id,
    }))
    return id
  }, [])

  const setActiveConversation = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeConversationId: id }))
  }, [])

  const addMessage = useCallback((conversationId: string, message: Message) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, message],
              updatedAt: new Date(),
            }
          : c
      ),
    }))
  }, [])

  const updateMessage = useCallback(
    (conversationId: string, messageId: string, content: string) => {
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === messageId ? { ...m, content } : m)),
              }
            : c
        ),
      }))
    },
    []
  )

  const updateMessageMetadata = useCallback(
    (conversationId: string, messageId: string, metadata: Partial<Message>) => {
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...metadata } : m)),
              }
            : c
        ),
      }))
    },
    []
  )

  const updateMessageStreaming = useCallback(
    (conversationId: string, messageId: string, isStreaming: boolean) => {
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === messageId ? { ...m, isStreaming } : m)),
              }
            : c
        ),
      }))
    },
    []
  )

  const updateConversationTitle = useCallback((conversationId: string, title: string) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) => (c.id === conversationId ? { ...c, title } : c)),
    }))
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setState((prev) => ({
      conversations: prev.conversations.filter((c) => c.id !== id),
      activeConversationId: prev.activeConversationId === id ? null : prev.activeConversationId,
    }))
  }, [])

  const clearAllConversations = useCallback(() => {
    setState(() => ({
      conversations: [],
      activeConversationId: null,
    }))
  }, [])

  return {
    ...store,
    activeConversation,
    createConversation,
    setActiveConversation,
    addMessage,
    updateMessage,
    updateMessageMetadata,
    updateMessageStreaming,
    updateConversationTitle,
    deleteConversation,
    clearAllConversations,
  }
}
