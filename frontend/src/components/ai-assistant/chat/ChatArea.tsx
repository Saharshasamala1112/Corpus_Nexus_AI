import { PanelRightOpen, PanelRightClose } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/ui/tooltip'
import { useChatStore } from '@/store/useChatStore'
import WelcomeView from './WelcomeView'
import ChatMessageList from './ChatMessageList'
import MessageInput from './MessageInput'
import type { Message } from '@/types/chat'
import { motion } from 'framer-motion'
import RobotIcon from '../RobotIcon'

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
    <div className="relative flex flex-1 flex-col min-w-0">
      {/* Top bar */}
      <div className="flex h-14 items-center justify-between border-b border-blue-500/10 bg-white/[0.02] px-4 shrink-0 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20">
                <RobotIcon size={18} className="text-white" />
              </div>
              <motion.span
                className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0F172A]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">CorpusGuard AI</span>
              <span className="block text-[10px] text-blue-300/60">Enterprise Assistant</span>
            </div>
          </div>
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-300">
            v2.0
          </span>
        </div>
        <Tooltip
          content={contextPanelOpen ? 'Close context' : 'Open context'}
          side="bottom"
          shortcut="⌘."
        >
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-blue-300/60 hover:text-blue-200 hover:bg-blue-500/10"
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
      <MessageInput onSend={onSend} onStop={onStop} isGenerating={isGenerating} />
    </div>
  )
}

export default ChatArea
