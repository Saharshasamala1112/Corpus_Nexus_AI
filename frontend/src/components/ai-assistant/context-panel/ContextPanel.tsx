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
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { useChatStore } from '@/store/useChatStore'
import { MOCK_CONTEXT_DOCUMENTS } from '@/lib/mock-data'

const ICON_MAP = {
  document: FileText,
  project: FolderGit2,
  repository: GitBranch,
  api: Globe,
  database: Database,
  docker: Container,
  architecture: BookOpen,
} as const

interface ContextSectionProps {
  type: string
  label: string
  items: typeof MOCK_CONTEXT_DOCUMENTS
}

function ContextSection({ type, label, items }: ContextSectionProps) {
  const [expanded, setExpanded] = useState(true)
  const Icon = ICON_MAP[type as keyof typeof ICON_MAP] || FileText

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-xs font-medium text-foreground">{label}</span>
        <Badge variant="secondary" className="text-[10px]">
          {items.length}
        </Badge>
        {expanded ? (
          <ChevronDown className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground" />
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
                  className="group flex items-start gap-2 rounded-lg px-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {item.source}
                    </p>
                    {item.snippet && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground/70 line-clamp-2">
                        {item.snippet}
                      </p>
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

  const grouped = MOCK_CONTEXT_DOCUMENTS.reduce(
    (acc, doc) => {
      if (!acc[doc.type]) acc[doc.type] = []
      acc[doc.type].push(doc)
      return acc
    },
    {} as Record<string, typeof MOCK_CONTEXT_DOCUMENTS>
  )

  const sections = [
    { type: 'document', label: 'Retrieved Documents' },
    { type: 'project', label: 'Related Projects' },
    { type: 'repository', label: 'Repository' },
    { type: 'api', label: 'APIs' },
    { type: 'database', label: 'Database Tables' },
    { type: 'docker', label: 'Docker Files' },
    { type: 'architecture', label: 'Architecture Documents' },
  ]

  return (
    <AnimatePresence>
      {contextPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="hidden lg:flex h-full flex-col border-l border-border bg-card overflow-hidden shrink-0"
        >
          <div className="flex h-12 items-center justify-between border-b border-border px-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Context</span>
              <Badge variant="secondary" className="text-[10px]">
                {MOCK_CONTEXT_DOCUMENTS.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              onClick={toggleContextPanel}
            >
              <PanelRightClose className="size-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sections.map((section) => {
              const items = grouped[section.type] || []
              if (items.length === 0) return null
              return (
                <ContextSection
                  key={section.type}
                  type={section.type}
                  label={section.label}
                  items={items}
                />
              )
            })}
          </div>
          <div className="border-t border-border px-4 py-3">
            <p className="text-[11px] text-muted-foreground text-center">
              Context auto-updates as you chat
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default ContextPanel
