import { PanelRightOpen, PanelRightClose, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/ui/tooltip'
import { useChatStore } from '@/store/useChatStore'
import WelcomeView from './WelcomeView'
import ChatMessageList from './ChatMessageList'
import MessageInput from './MessageInput'
import type { Message } from '@/types/chat'

interface ChatAreaProps {
  messages: Message[]
  isGenerating: boolean
  onSend: (message: string) => void
  onStop: () => void
}

function ChatArea({ messages, isGenerating, onSend, onStop }: ChatAreaProps) {
  const { contextPanelOpen, toggleContextPanel } = useChatStore()
  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-1 flex-col min-w-0 bg-background">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between border-b border-border px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="size-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">CorpusGuard AI</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            Enterprise
          </span>
        </div>
        <Tooltip content={contextPanelOpen ? 'Close context' : 'Open context'} side="bottom" shortcut="⌘.">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={toggleContextPanel}
          >
            {contextPanelOpen ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelRightOpen className="size-4" />
            )}
          </Button>
        </Tooltip>
      </div>

      {/* Messages or Welcome */}
      {hasMessages ? (
        <ChatMessageList messages={messages} isGenerating={isGenerating} />
      ) : (
        <WelcomeView onSendPrompt={onSend} />
      )}

      {/* Input */}
      <MessageInput
        onSend={onSend}
        onStop={onStop}
        isGenerating={isGenerating}
      />
    </div>
  )
}

export default ChatArea
