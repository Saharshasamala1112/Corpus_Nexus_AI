import { Bot, PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/ui/tooltip'
import { useChatStore } from '@/store/useChatStore'
import { useConversationStore } from '@/store/useConversationStore'

function SidebarHeader() {
  const { sidebarOpen, toggleSidebar } = useChatStore()
  const { createConversation } = useConversationStore()

  const handleNewChat = () => {
    createConversation()
  }

  return (
    <div className="flex items-center justify-between px-3 py-3 border-b border-border">
      {sidebarOpen ? (
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate">CorpusGuard</h2>
            <p className="text-[11px] text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      ) : (
        <Tooltip content="New Chat" side="right" shortcut="⌘N">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleNewChat}>
            <Bot className="size-4" />
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
          className="shrink-0 text-muted-foreground"
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
