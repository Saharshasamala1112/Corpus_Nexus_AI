import { useCallback, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useChatStore } from '@/store/useChatStore'
import { useConversationStore } from '@/store/useConversationStore'
import { streamChatMessage, listConversations } from '@/services/api'
import type { Message } from '@/types/chat'
import BlueBotMascot from './BlueBotMascot'
import WelcomeView from './chat/WelcomeView'
import ChatMessageList from './chat/ChatMessageList'
import MessageInput from './chat/MessageInput'

function AIAssistantDrawer() {
  const { aiDrawerOpen, setAiDrawerOpen, isGenerating, setGenerating, setStreaming } =
    useChatStore()

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
            case 'meta': {
              const conversationId =
                typeof event.conversation_id === 'string' ? event.conversation_id : undefined
              if (conversationId && conversationId !== convId) {
                resolvedConversationId = conversationId
                setActiveConversation(conversationId)
              }
              break
            }
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
          `**Error:** ${errorMsg}\n\nPlease check that the backend server is running at \`http://localhost:8001\`.`
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
  const hasMessages = messages.length > 0

  const username = useMemo(() => {
    return localStorage.getItem('username') || 'Saharsha'
  }, [])

  return (
    <AnimatePresence>
      {aiDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setAiDrawerOpen(false)}
          />

          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed right-6 z-50 flex flex-col overflow-hidden bg-gradient-to-b from-[#0A0F1E] via-[#0D1320] to-[#020617] shadow-2xl w-[calc(100vw-48px)] sm:w-[55%] lg:w-[48%] xl:w-[42%]"
            style={{
              top: 24,
              bottom: 24,
              maxWidth: 640,
              borderRadius: 28,
              boxShadow: '0 0 30px rgba(59,130,246,0.08), 0 0 60px rgba(59,130,246,0.04)',
            }}
          >
            {/* Animated neon border overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: 28,
                padding: 1,
                background:
                  'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.05), rgba(34,211,238,0.15), rgba(59,130,246,0.3))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: 28,
                padding: 1,
                background:
                  'linear-gradient(135deg, rgba(59,130,246,0.2), transparent, transparent, rgba(59,130,246,0.15))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Ambient glow */}
            <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

            {/* Header with centered robot */}
            <div className="relative shrink-0 border-b border-blue-500/10 bg-white/[0.02] backdrop-blur-xl">
              <div className="flex flex-col items-center pt-6 pb-5 px-5">
                <div className="relative mb-3">
                  <BlueBotMascot />
                </div>
                {!hasMessages && (
                  <div className="text-center">
                    <h1 className="text-xl font-bold text-white mb-1">
                      Hi, {username} <span className="inline-block">👋</span>
                    </h1>
                    <p className="text-sm text-blue-200/50 max-w-xs mx-auto leading-relaxed">
                      I'm your Enterprise AI Assistant.
                      <br />
                      Ask me anything about Corpus Nexus.
                    </p>
                  </div>
                )}
                {hasMessages && (
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">CorpusGuard AI</h2>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                      <span className="text-[10px] font-medium text-emerald-300">Online</span>
                    </span>
                  </div>
                )}
              </div>
              {/* Close button */}
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-xl text-blue-300/40 hover:text-white hover:bg-white/[0.05] transition-all"
                aria-label="Close assistant"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Welcome or Chat */}
            <div className="relative flex-1 flex flex-col min-h-0">
              {hasMessages ? (
                <ChatMessageList messages={messages} isGenerating={isGenerating} />
              ) : (
                <WelcomeView onSendPrompt={handleSend} />
              )}
            </div>

            {/* Input */}
            <div className="relative shrink-0">
              <MessageInput onSend={handleSend} onStop={handleStop} isGenerating={isGenerating} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default AIAssistantDrawer
