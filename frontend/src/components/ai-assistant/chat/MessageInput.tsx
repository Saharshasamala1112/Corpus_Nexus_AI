import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Square, Paperclip, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Avatar from '@/components/ui/avatar'

interface MessageInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  isGenerating: boolean
  disabled?: boolean
}

function MessageInput({ onSend, onStop, isGenerating, disabled }: MessageInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  useEffect(() => {
    if (!isGenerating && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isGenerating])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isGenerating) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-gradient-to-t from-[#020617] via-[#0A0F1E] to-transparent px-4 pt-3 pb-4">
      <div className="flex items-end gap-2 rounded-2xl border border-blue-500/20 bg-white/[0.03] shadow-lg shadow-blue-500/5 transition-all duration-300 focus-within:border-blue-500/40 focus-within:shadow-blue-500/10">
        {/* Left: Robot avatar + Attachment */}
        <div className="flex items-center gap-1 pl-3 pb-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm">
            <Avatar
              fallback="AI"
              size="sm"
              className="!bg-transparent !text-white !text-[10px] !font-bold !ring-0 !size-7"
            />
          </div>
          <button
            className="flex size-7 items-center justify-center rounded-lg text-blue-300/30 hover:text-blue-200 hover:bg-blue-500/10 transition-all"
            aria-label="Attach file"
          >
            <Paperclip className="size-3.5" />
          </button>
        </div>

        {/* Center: Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CorpusGuard AI anything about projects, repositories, APIs, Docker, databases, documentation, infrastructure, authentication, deployments, bugs, or company knowledge..."
          disabled={disabled || isGenerating}
          rows={1}
          className="flex-1 resize-none bg-transparent py-3 text-sm text-white placeholder:text-blue-300/20 focus:outline-none disabled:opacity-50 min-h-[40px] max-h-[120px]"
        />

        {/* Right: Mic + Send */}
        <div className="flex items-center gap-1 pr-2 pb-2">
          <button
            className="flex size-7 items-center justify-center rounded-lg text-blue-300/30 hover:text-blue-200 hover:bg-blue-500/10 transition-all"
            aria-label="Voice input"
          >
            <Mic className="size-3.5" />
          </button>

          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="stop"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  onClick={onStop}
                  className="flex size-7 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  aria-label="Stop generating"
                >
                  <Square className="size-3 fill-current" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  onClick={handleSend}
                  disabled={!value.trim()}
                  className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed hover:from-blue-400 hover:to-blue-500 transition-all disabled:shadow-none"
                  aria-label="Send message"
                >
                  <Send className="size-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default MessageInput
