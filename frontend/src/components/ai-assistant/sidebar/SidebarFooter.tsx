import { Plus, Search, Trash2, Settings, Moon, Sun, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/ui/tooltip'
import { useChatStore } from '@/store/useChatStore'
import { useConversationStore } from '@/store/useConversationStore'
import { useTheme } from '@/hooks/useTheme'

function SidebarFooter() {
  const { sidebarOpen } = useChatStore()
  const { createConversation, clearAllConversations } = useConversationStore()
  const { theme, setTheme } = useTheme()

  const handleNewChat = () => {
    createConversation()
  }

  const handleClearHistory = () => {
    clearAllConversations()
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!sidebarOpen) {
    return (
      <div className="flex flex-col items-center gap-1 py-2 border-t border-border px-2">
        <Tooltip content="New Chat" side="right" shortcut="⌘N">
          <Button variant="ghost" size="icon" onClick={handleNewChat}>
            <Plus className="size-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Settings" side="right">
          <Button variant="ghost" size="icon">
            <Settings className="size-4" />
          </Button>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="border-t border-border p-2 space-y-1">
      <div className="flex gap-1">
        <Tooltip content="New Chat" shortcut="⌘N" side="top">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2 text-muted-foreground"
            onClick={handleNewChat}
          >
            <Plus className="size-4" />
            New Chat
          </Button>
        </Tooltip>
        <Tooltip content="Search" shortcut="⌘K" side="top">
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <Search className="size-4" />
          </Button>
        </Tooltip>
      </div>
      <div className="flex gap-1">
        <Tooltip content="Clear history" side="top">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2 text-muted-foreground"
            onClick={handleClearHistory}
          >
            <Trash2 className="size-4" />
            Clear History
          </Button>
        </Tooltip>
        <Tooltip content={theme === 'dark' ? 'Light mode' : 'Dark mode'} side="top">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </Tooltip>
      </div>
      <div className="flex gap-1">
        <Tooltip content="Settings" side="top">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2 text-muted-foreground"
          >
            <Settings className="size-4" />
            Settings
          </Button>
        </Tooltip>
        <Tooltip content="Account" side="top">
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <LogOut className="size-4" />
          </Button>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          SC
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground truncate">Sarah Chen</p>
          <p className="text-[10px] text-muted-foreground truncate">Senior Engineer</p>
        </div>
      </div>
    </div>
  )
}

export default SidebarFooter
