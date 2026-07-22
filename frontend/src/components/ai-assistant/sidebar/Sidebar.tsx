import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'
import SidebarHeader from './SidebarHeader'
import SearchInput from './SearchInput'
import ConversationList from './ConversationList'
import SidebarFooter from './SidebarFooter'

function Sidebar() {
  const { sidebarOpen, searchQuery, setSearchQuery } = useChatStore()

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-[280px]' : 'w-[56px]'
      )}
    >
      <SidebarHeader />
      <SearchInput onSearch={setSearchQuery} />
      <ConversationList searchQuery={searchQuery} />
      <SidebarFooter />
    </aside>
  )
}

export default Sidebar
