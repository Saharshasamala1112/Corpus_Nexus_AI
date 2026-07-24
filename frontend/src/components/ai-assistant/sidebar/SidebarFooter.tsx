import { User, HelpCircle, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/ui/tooltip'
import { useChatStore } from '@/store/useChatStore'
import { useNavigate } from 'react-router-dom'

function SidebarFooter() {
  const { sidebarOpen } = useChatStore()
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'User'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('phone')
    navigate('/', { replace: true })
  }

  if (!sidebarOpen) {
    return (
      <div className="flex flex-col items-center gap-1 py-2 border-t border-blue-500/10 px-2">
        <Tooltip content="Account" side="right">
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-300/40 hover:text-blue-200 hover:bg-blue-500/10"
          >
            <User className="size-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Dashboard" side="right">
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-300/40 hover:text-blue-200 hover:bg-blue-500/10"
            onClick={() => navigate('/')}
          >
            <LayoutDashboard className="size-4" />
          </Button>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="border-t border-blue-500/10">
      {/* User account section */}
      <div className="px-3 py-2.5 border-b border-blue-500/10">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-[11px] font-bold text-white shadow-lg shadow-blue-500/20 shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-blue-200 truncate">{username}</p>
            <p className="text-[10px] text-blue-300/30 truncate">Enterprise Account</p>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="py-1.5 space-y-0.5">
        <NavItem icon={User} label="Profile" />
        <NavItem icon={HelpCircle} label="Help & Support" />
        <div className="border-t border-blue-500/10 my-1.5" />
        <NavItem icon={LayoutDashboard} label="Back to Dashboard" onClick={() => navigate('/')} />
        <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
}

function NavItem({ icon: Icon, label, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-blue-200/40 hover:text-blue-200 hover:bg-blue-500/[0.04] transition-all rounded-lg group"
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

export default SidebarFooter
