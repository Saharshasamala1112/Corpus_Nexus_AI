import { motion } from 'framer-motion'
import { Copy, Check, FileText, ExternalLink, Shield } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '@/types/chat'
import Badge from '@/components/ui/badge'
import Tooltip from '@/components/ui/tooltip'
import MarkdownContent from './MarkdownContent'
import RobotIcon from '../RobotIcon'

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
    if (score >= 80) return 'text-emerald-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'High Confidence'
    if (score >= 50) return 'Medium Confidence'
    return 'Low Confidence'
  }

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex justify-end px-4 py-2"
      >
        <div className="max-w-[80%]">
          <div className="relative rounded-2xl rounded-br-md bg-gradient-to-br from-blue-600 to-blue-500 px-4 py-3 shadow-lg shadow-blue-500/20">
            <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 mt-1 px-1">
            <span className="text-[10px] text-blue-300/30">{time}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="px-4 py-2"
    >
      <div className="max-w-[85%]">
        <div className="flex items-start gap-2.5">
          <div className="relative shrink-0 mt-1">
            <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-500/20">
              <RobotIcon size={14} className="text-blue-300" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-blue-200">CorpusGuard AI</span>
              <span className="text-[10px] text-blue-300/25">{time}</span>
              {confidence !== undefined && (
                <Tooltip content={getConfidenceLabel(confidence)} side="top">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] ${getConfidenceColor(confidence)}`}
                  >
                    <Shield className="size-2.5" />
                    {Math.round(confidence)}%
                  </span>
                </Tooltip>
              )}
            </div>

            <div className="relative rounded-2xl rounded-tl-md border border-blue-500/10 bg-white/[0.03] p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/[0.02] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <MarkdownContent content={message.content} />

                {message.sources_used && message.sources_used.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-blue-500/10">
                    <button
                      onClick={() => setShowSources(!showSources)}
                      className="flex items-center gap-1.5 text-xs text-blue-300/40 hover:text-blue-200 transition-colors"
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
                            className="flex items-center gap-2 rounded-lg border border-blue-500/10 bg-white/[0.02] px-3 py-1.5"
                          >
                            <Badge
                              variant="outline"
                              className="text-[10px] text-blue-300 border-blue-500/20"
                            >
                              {i + 1}
                            </Badge>
                            <code className="text-xs text-blue-200/40 truncate">{source}</code>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}

                {message.retrieved_documents && message.retrieved_documents.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {message.retrieved_documents.slice(0, 5).map((doc) => (
                      <Badge
                        key={doc.id}
                        variant="secondary"
                        className="text-[10px] border-blue-500/20 bg-blue-500/10 text-blue-200/50"
                      >
                        {doc.filename} ({Math.round(doc.score * 100)}%)
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1.5 px-1">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-blue-300/25 hover:text-blue-200 hover:bg-blue-500/10 transition-all"
              >
                {copied ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Copy className="size-3" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage
