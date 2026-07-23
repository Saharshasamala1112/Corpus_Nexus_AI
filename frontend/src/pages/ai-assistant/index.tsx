import { useCallback } from 'react'
import { useConversationStore } from '@/store/useConversationStore'
import { useChatStore } from '@/store/useChatStore'
import { sendChatMessage } from '@/services/api'
import type { Message } from '@/types/chat'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import Sidebar from '@/components/ai-assistant/sidebar/Sidebar'
import ChatArea from '@/components/ai-assistant/chat/ChatArea'
import ContextPanel from '@/components/ai-assistant/context-panel/ContextPanel'

function AIAssistantPage() {
  const {
    activeConversation,
    activeConversationId,
    createConversation,
    addMessage,
    updateMessage,
    updateMessageMetadata,
    updateMessageStreaming,
    setActiveConversation,
  } = useConversationStore()

  const { isGenerating, setGenerating, setStreaming } = useChatStore()

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

      try {
        const response = await sendChatMessage({
          message: content,
          conversation_id:
            convId !== activeConversationId ? convId : activeConversationId || undefined,
        })

        updateMessage(convId, assistantMessage.id, response.message.content)

        updateMessageMetadata(convId, assistantMessage.id, {
          confidence_score: response.confidence_score,
          sources_used: response.sources_used,
          retrieved_documents: response.retrieved_documents,
        })

        updateMessageStreaming(convId, assistantMessage.id, false)

        if (response.conversation_id && response.conversation_id !== convId) {
          setActiveConversation(response.conversation_id)
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Failed to get response from server'
        updateMessage(
          convId,
          assistantMessage.id,
          `**Error:** ${errorMsg}\n\nPlease check that the backend server is running at \`http://localhost:8000\`.`
        )
        updateMessageStreaming(convId, assistantMessage.id, false)
      } finally {
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
