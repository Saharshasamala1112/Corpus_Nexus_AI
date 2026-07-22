import { useCallback } from 'react'
import { useConversationStore } from '@/store/useConversationStore'
import { useChatStore } from '@/store/useChatStore'
import { useStreamingSimulation } from '@/hooks/useStreamingSimulation'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import type { Message } from '@/types/chat'
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
    updateMessageStreaming,
  } = useConversationStore()

  const {
    isGenerating,
    setGenerating,
    setStreaming,
    toggleSidebar,
    toggleContextPanel,
  } = useChatStore()

  const { simulateStreaming, stopStreaming } = useStreamingSimulation({
    onComplete: () => {
      setGenerating(false)
      setStreaming(false)
    },
  })

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

      await simulateStreaming(content, (chunkedText) => {
        updateMessage(convId!, assistantMessage.id, chunkedText)
      })

      updateMessageStreaming(convId, assistantMessage.id, false)
      setGenerating(false)
      setStreaming(false)
    },
    [
      activeConversationId,
      createConversation,
      addMessage,
      setGenerating,
      setStreaming,
      simulateStreaming,
      updateMessage,
      updateMessageStreaming,
    ]
  )

  const handleStop = useCallback(() => {
    stopStreaming()
    setGenerating(false)
    setStreaming(false)
  }, [stopStreaming, setGenerating, setStreaming])

  useKeyboardShortcuts({
    newChat: () => createConversation(),
    toggleSidebar,
    toggleContext: toggleContextPanel,
    stopGeneration: handleStop,
  })

  const messages = activeConversation?.messages || []

  return (
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
  )
}

export default AIAssistantPage
