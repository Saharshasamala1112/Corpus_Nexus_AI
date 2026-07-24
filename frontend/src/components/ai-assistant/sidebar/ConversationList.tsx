import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConversationStore } from '@/store/useConversationStore'
import { useChatStore } from '@/store/useChatStore'
import { motion } from 'framer-motion'

interface ConversationItemProps {
  id: string
  title: string
  isActive: boolean
  onClick: () => void
}

function ConversationItem({ id, title, isActive, onClick }: ConversationItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateConversationTitle, deleteConversation } = useConversationStore()

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== title) {
      updateConversationTitle(id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteConversation(id)
  }

  const handleRenameStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setShowActions(false)
  }

  if (isEditing) {
    return (
      <div className="group mx-2 flex items-center rounded-xl border border-blue-500/20 bg-white/[0.05] px-3 py-2">
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') setIsEditing(false)
          }}
          className="w-full bg-transparent text-sm text-white outline-none"
        />
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ x: 2 }}
      className={cn(
        'group mx-2 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all',
        isActive
          ? 'bg-blue-500/10 text-white border border-blue-500/20 shadow-sm'
          : 'text-blue-200/50 hover:bg-white/[0.03] hover:text-blue-200 border border-transparent'
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <MessageSquare
        className={cn('size-4 shrink-0', isActive ? 'text-blue-400' : 'text-blue-300/30')}
      />
      <span className="truncate flex-1">{title}</span>
      {showActions && (
        <div className="flex shrink-0 gap-0.5">
          <button
            onClick={handleRenameStart}
            className="rounded p-1 text-blue-300/30 hover:text-blue-200 hover:bg-blue-500/10 transition-all"
          >
            <Pencil className="size-3" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded p-1 text-blue-300/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      )}
    </motion.div>
  )
}

interface ConversationListProps {
  searchQuery: string
}

function ConversationList({ searchQuery }: ConversationListProps) {
  const { conversations, activeConversationId, setActiveConversation } = useConversationStore()
  const { sidebarOpen } = useChatStore()

  const filtered = searchQuery
    ? conversations.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations

  if (!sidebarOpen) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const grouped = filtered.reduce(
    (acc, conv) => {
      const convDate = new Date(conv.updatedAt)
      convDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((today.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) acc.today.push(conv)
      else if (diffDays <= 7) acc.thisWeek.push(conv)
      else acc.older.push(conv)

      return acc
    },
    {
      today: [] as typeof filtered,
      thisWeek: [] as typeof filtered,
      older: [] as typeof filtered,
    }
  )

  const renderGroup = (label: string, items: typeof filtered) => {
    if (items.length === 0) return null
    return (
      <div key={label} className="mb-2">
        <p className="px-5 py-1.5 text-[10px] font-medium text-blue-300/30 uppercase tracking-wider">
          {label}
        </p>
        {items.map((conv) => (
          <ConversationItem
            key={conv.id}
            id={conv.id}
            title={conv.title}
            isActive={conv.id === activeConversationId}
            onClick={() => setActiveConversation(conv.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
      {renderGroup('Today', grouped.today)}
      {renderGroup('Previous 7 days', grouped.thisWeek)}
      {renderGroup('Older', grouped.older)}
    </div>
  )
}

export default ConversationList
