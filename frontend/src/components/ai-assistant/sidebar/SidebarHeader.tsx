import { PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/ui/tooltip'
import { useChatStore } from '@/store/useChatStore'
import { useConversationStore } from '@/store/useConversationStore'
import { motion } from 'framer-motion'
import RobotIcon from '../RobotIcon'

function SidebarHeader() {
  const { sidebarOpen, toggleSidebar } = useChatStore()
  const { createConversation } = useConversationStore()

  const handleNewChat = () => {
    createConversation()
  }

  return (
    <div className="flex items-center justify-between px-3 py-3 border-b border-blue-500/10">
      {sidebarOpen ? (
        <div className="flex items-center gap-2 min-w-0">
          <motion.div
            className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="size-4 text-white" />
          </motion.div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">CorpusGuard</h2>
            <p className="text-[10px] text-blue-300/40">AI Assistant</p>
          </div>
        </div>
      ) : (
        <Tooltip content="New Chat" side="right" shortcut="⌘N">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-blue-300/40 hover:text-blue-200 hover:bg-blue-500/10"
            onClick={handleNewChat}
          >
            <RobotIcon size={18} className="text-blue-300/40" />
          </Button>
        </Tooltip>
      )}

      <Tooltip
        content={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        side="right"
        shortcut="⌘B"
      >
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-blue-300/40 hover:text-blue-200 hover:bg-blue-500/10"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>
      </Tooltip>
    </div>
  )
}

export default SidebarHeader
