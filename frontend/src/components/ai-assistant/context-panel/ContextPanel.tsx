import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  FolderGit2,
  GitBranch,
  Globe,
  Database,
  Container,
  BookOpen,
  ChevronDown,
  ChevronRight,
  PanelRightClose,
  Brain,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { useChatStore } from '@/store/useChatStore'
import { useConversationStore } from '@/store/useConversationStore'

const ICON_MAP: Record<string, typeof FileText> = {
  document: FileText,
  project: FolderGit2,
  repository: GitBranch,
  api: Globe,
  database: Database,
  docker: Container,
  architecture: BookOpen,
}

interface ContextSectionProps {
  type: string
  label: string
  items: Array<{ id: string; title: string; source: string; snippet?: string; score?: number }>
}

function ContextSection({ type, label, items }: ContextSectionProps) {
  const [expanded, setExpanded] = useState(true)
  const Icon = ICON_MAP[type] || FileText

  return (
    <div className="border-b border-blue-500/10 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <Icon className="size-4 shrink-0 text-blue-300/40" />
        <span className="flex-1 text-xs font-medium text-blue-200">{label}</span>
        <Badge
          variant="secondary"
          className="text-[10px] border-blue-500/20 bg-blue-500/10 text-blue-200/60"
        >
          {items.length}
        </Badge>
        {expanded ? (
          <ChevronDown className="size-3.5 text-blue-300/40" />
        ) : (
          <ChevronRight className="size-3.5 text-blue-300/40" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 px-2 pb-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-2 rounded-xl px-2 py-2 cursor-pointer hover:bg-white/[0.02] transition-colors border border-transparent hover:border-blue-500/10"
                >
                  <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-blue-400/40" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-blue-200/80 truncate group-hover:text-blue-200 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-blue-300/30 truncate">{item.source}</p>
                    {item.snippet && (
                      <p className="mt-0.5 text-[10px] text-blue-300/20 line-clamp-2">
                        {item.snippet}
                      </p>
                    )}
                    {item.score !== undefined && (
                      <span className="text-[10px] text-blue-300/20">
                        Relevance: {Math.round(item.score * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ContextPanel() {
  const { contextPanelOpen, toggleContextPanel } = useChatStore()
  const { activeConversation } = useConversationStore()

  const documents = useMemo(() => {
    if (!activeConversation) return []

    const lastAssistantMsg = [...activeConversation.messages]
      .reverse()
      .find(
        (m) => m.role === 'assistant' && m.retrieved_documents && m.retrieved_documents.length > 0
      )

    if (!lastAssistantMsg?.retrieved_documents) return []

    return lastAssistantMsg.retrieved_documents.map((doc) => ({
      id: doc.id,
      title: doc.filename,
      type: 'document' as const,
      source: doc.file_path,
      score: doc.score,
      snippet: `Type: ${doc.document_type} | Language: ${doc.language}`,
    }))
  }, [activeConversation])

  const sourceFiles = useMemo(() => {
    if (!activeConversation) return []

    const lastAssistantMsg = [...activeConversation.messages]
      .reverse()
      .find((m) => m.role === 'assistant' && m.sources_used && m.sources_used.length > 0)

    if (!lastAssistantMsg?.sources_used) return []

    return lastAssistantMsg.sources_used.map((src, i) => ({
      id: `src_${i}`,
      title: src.split('/').pop() || src,
      type: 'repository' as const,
      source: src,
    }))
  }, [activeConversation])

  const reasoning = useMemo(() => {
    if (!activeConversation) return null
    const lastAssistantMsg = [...activeConversation.messages]
      .reverse()
      .find((m) => m.role === 'assistant' && m.reasoning_steps && m.reasoning_steps.length > 0)
    return lastAssistantMsg?.reasoning_steps || null
  }, [activeConversation])

  return (
    <AnimatePresence>
      {contextPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="hidden lg:flex h-full flex-col border-l border-blue-500/10 bg-[#0A0F1E]/60 backdrop-blur-2xl overflow-hidden shrink-0"
        >
          <div className="flex h-14 items-center justify-between border-b border-blue-500/10 px-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-400/60" />
              <span className="text-sm font-medium text-blue-200">Context</span>
              <Badge
                variant="secondary"
                className="text-[10px] border-blue-500/20 bg-blue-500/10 text-blue-200/60"
              >
                {activeConversation ? activeConversation.messages.length : 0}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-blue-300/40 hover:text-blue-200 hover:bg-blue-500/10"
              onClick={toggleContextPanel}
            >
              <PanelRightClose className="size-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {reasoning && reasoning.length > 0 && (
              <div className="border-b border-blue-500/10">
                <div className="flex items-center gap-2 px-4 py-3">
                  <Brain className="size-4 text-blue-300/40" />
                  <span className="text-xs font-medium text-blue-200">AI Reasoning</span>
                </div>
                <div className="px-4 pb-3 space-y-1">
                  {reasoning.map((step) => (
                    <div key={step.step} className="flex items-start gap-2 py-1">
                      <span className="text-[10px] text-blue-300/30 font-mono shrink-0 w-4">
                        {step.step}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] text-blue-200/50">{step.thought}</p>
                        {step.tool_used && (
                          <Badge
                            variant="outline"
                            className="text-[9px] mt-0.5 border-blue-500/20 text-blue-300/40"
                          >
                            {step.tool_used}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sourceFiles.length > 0 && (
              <ContextSection type="repository" label="Source References" items={sourceFiles} />
            )}
            {documents.length > 0 && (
              <ContextSection type="document" label="Retrieved Documents" items={documents} />
            )}
            {documents.length === 0 && sourceFiles.length === 0 && !reasoning && (
              <div className="flex flex-1 items-center justify-center p-8 text-center">
                <div className="text-xs text-blue-300/30">
                  <FileText className="mx-auto mb-3 size-10 opacity-30" />
                  <p>Ask a question to see</p>
                  <p>retrieved context here</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-blue-500/10 px-4 py-3">
            <p className="text-[10px] text-blue-300/20 text-center">
              Context auto-updates as you chat
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default ContextPanel
