import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Square } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/ui/tooltip'

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
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
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
    <div className="border-t border-border bg-card p-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-xl border border-input bg-background shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your codebase..."
            disabled={disabled || isGenerating}
            rows={1}
            className="flex-1 resize-none bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 min-h-[44px] max-h-[200px]"
          />
          <div className="flex shrink-0 items-center gap-1 pr-2 pb-2">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="stop"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Tooltip content="Stop generating" side="top" shortcut="Esc">
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={onStop}
                      className="rounded-lg"
                    >
                      <Square className="size-3.5 fill-current" />
                    </Button>
                  </Tooltip>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Tooltip content="Send message" side="top">
                    <Button
                      variant="default"
                      size="icon-sm"
                      onClick={handleSend}
                      disabled={!value.trim()}
                      className="rounded-lg"
                    >
                      <Send className="size-3.5" />
                    </Button>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          CorpusGuard AI can make mistakes. Verify critical information.
        </p>
      </div>
    </div>
  )
}

export default MessageInput
