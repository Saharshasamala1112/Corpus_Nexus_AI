import { useCallback, useEffect, useRef } from 'react'
import { useConversationStore } from '@/store/useConversationStore'
import { useChatStore } from '@/store/useChatStore'
import { streamChatMessage, listConversations } from '@/services/api'
import type { Message } from '@/types/chat'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import Sidebar from '@/components/ai-assistant/sidebar/Sidebar'
import ChatArea from '@/components/ai-assistant/chat/ChatArea'
import ContextPanel from '@/components/ai-assistant/context-panel/ContextPanel'

function AIAssistantPage() {
  const {
    activeConversation,
    activeConversationId,
    conversations,
    createConversation,
    addMessage,
    updateMessage,
    updateMessageMetadata,
    updateMessageStreaming,
    setActiveConversation,
  } = useConversationStore()

  const { isGenerating, setGenerating, setStreaming } = useChatStore()

  const abortRef = useRef<AbortController | null>(null)
  const syncGuard = useRef(false)

  useEffect(() => {
    if (syncGuard.current) return
    syncGuard.current = true
    listConversations()
      .then((res) => {
        const serverConvs = res.conversations || []
        const localIds = new Set(conversations.map((c) => c.id))
        for (const sc of serverConvs) {
          if (!localIds.has(sc.id)) {
            createConversation(sc.title, sc.id)
          }
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSend = useCallback(
    async (content: string) => {
      let convId = activeConversationId

      if (!convId) {
        convId = createConversation(content)
      }

      const userMessage: Message = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content,
        timestamp: new Date(),
      }
      addMessage(convId, userMessage)

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      }
      addMessage(convId, assistantMessage)

      setGenerating(true)
      setStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      let resolvedConversationId = convId

      try {
        for await (const event of streamChatMessage(
          {
            message: content,
            conversation_id:
              convId !== activeConversationId ? convId : activeConversationId || undefined,
          },
          controller.signal
        )) {
          switch (event.type) {
            case 'meta':
              if (event.conversation_id && event.conversation_id !== convId) {
                resolvedConversationId = event.conversation_id
                setActiveConversation(event.conversation_id)
              }
              break
            case 'content':
              updateMessage(convId, assistantMessage.id, event.content as string)
              break
            case 'done': {
              const done = event as Record<string, unknown>
              updateMessageMetadata(convId, assistantMessage.id, {
                confidence_score: done.confidence_score as number,
                sources_used: done.sources_used as string[],
              })
              updateMessageStreaming(convId, assistantMessage.id, false)
              if (resolvedConversationId !== convId) {
                setActiveConversation(resolvedConversationId)
              }
              break
            }
            case 'documents':
              updateMessageMetadata(convId, assistantMessage.id, {
                retrieved_documents: (event as Record<string, unknown>).documents as [],
              })
              break
            case 'error':
              throw new Error((event as Record<string, unknown>).message as string)
          }
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        const errorMsg =
          error instanceof Error ? error.message : 'Failed to get response from server'
        updateMessage(
          convId,
          assistantMessage.id,
          `**Error:** ${errorMsg}\n\nPlease check that the backend server is running at \`http://localhost:8000\`.`
        )
        updateMessageStreaming(convId, assistantMessage.id, false)
      } finally {
        abortRef.current = null
        setGenerating(false)
        setStreaming(false)
      }
    },
    [
      activeConversationId,
      createConversation,
      addMessage,
      updateMessage,
      updateMessageMetadata,
      updateMessageStreaming,
      setGenerating,
      setStreaming,
      setActiveConversation,
    ]
  )

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    setGenerating(false)
    setStreaming(false)
  }, [setGenerating, setStreaming])

  const messages = activeConversation?.messages || []

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <ChatArea
          messages={messages}
          isGenerating={isGenerating}
          onSend={handleSend}
          onStop={handleStop}
        />
        <ContextPanel />
      </div>
    </ErrorBoundary>
  )
}

export default AIAssistantPage
