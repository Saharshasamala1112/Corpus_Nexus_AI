import { motion } from 'framer-motion'
import { Copy, Check, FileText, ExternalLink, Shield } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '@/types/chat'
import Avatar from '@/components/ui/avatar'
import Badge from '@/components/ui/badge'
import Tooltip from '@/components/ui/tooltip'
import MarkdownContent from './MarkdownContent'

interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(message.content)
      setCopied(true)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = message.content
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
    }
    setTimeout(() => setCopied(false), 2000)
  }

  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const confidence = message.confidence_score

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'High Confidence'
    if (score >= 50) return 'Medium Confidence'
    return 'Low Confidence'
  }

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
            {!isUser && confidence !== undefined && (
              <Tooltip content={getConfidenceLabel(confidence)} side="top">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] ${getConfidenceColor(confidence)}`}
                >
                  <Shield className="size-3" />
                  {Math.round(confidence)}%
                </span>
              </Tooltip>
            )}
          </div>

          {isUser ? (
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <>
              <MarkdownContent content={message.content} />

              {message.sources_used && message.sources_used.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowSources(!showSources)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FileText className="size-3.5" />
                    <span>
                      {message.sources_used.length} source
                      {message.sources_used.length > 1 ? 's' : ''}
                    </span>
                    <ExternalLink
                      className={`size-3 transition-transform ${showSources ? 'rotate-90' : ''}`}
                    />
                  </button>
                  {showSources && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      {message.sources_used.map((source, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5"
                        >
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {i + 1}
                          </Badge>
                          <code className="text-xs text-muted-foreground truncate">{source}</code>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {message.retrieved_documents && message.retrieved_documents.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {message.retrieved_documents.slice(0, 5).map((doc) => (
                    <Badge key={doc.id} variant="secondary" className="text-[10px]">
                      {doc.filename} ({Math.round(doc.score * 100)}%)
                    </Badge>
                  ))}
                </div>
              )}

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
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage
