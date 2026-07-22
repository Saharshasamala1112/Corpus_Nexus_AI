import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '@/types/chat'
import Avatar from '@/components/ui/avatar'
import Tooltip from '@/components/ui/tooltip'
import MarkdownContent from './MarkdownContent'

interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group px-4 py-4 ${!isUser ? 'bg-muted/30' : ''}`}
    >
      <div className="mx-auto flex max-w-3xl gap-4">
        <Avatar
          fallback={isUser ? 'SC' : 'AI'}
          size="sm"
          className={isUser ? '' : 'bg-primary/10 text-primary ring-1 ring-primary/20'}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {isUser ? 'You' : 'CorpusGuard AI'}
            </span>
            <span className="text-[11px] text-muted-foreground">{time}</span>
          </div>

          {isUser ? (
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <MarkdownContent content={message.content} />
          )}

          {!isUser && (
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip content={copied ? 'Copied!' : 'Copy response'} side="top">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <Check className="size-3 text-green-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage
