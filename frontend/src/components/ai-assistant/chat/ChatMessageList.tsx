import { useEffect } from 'react'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import type { Message } from '@/types/chat'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

interface ChatMessageListProps {
  messages: Message[]
  isGenerating: boolean
}

function ChatMessageList({ messages, isGenerating }: ChatMessageListProps) {
  const { scrollRef, scrollIfAutoScrolling } = useAutoScroll()

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollIfAutoScrolling()
    }, 50)
    return () => clearTimeout(timer)
  }, [messages, isGenerating, scrollIfAutoScrolling])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="py-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isGenerating && <TypingIndicator />}
      </div>
      <div id="scroll-anchor" className="h-px" />
    </div>
  )
}

export default ChatMessageList
