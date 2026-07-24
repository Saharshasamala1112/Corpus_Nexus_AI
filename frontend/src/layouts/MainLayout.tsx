import { Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import AIAssistantButton from '@/components/ai-assistant/AIAssistantButton'
import AIAssistantDrawer from '@/components/ai-assistant/AIAssistantDrawer'
import { LogOut, User, Menu, X } from 'lucide-react'

function MainLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('phone')
    setIsMenuOpen(false)
    navigate('/', { replace: true })
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Professional Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-lg font-bold text-white">CN</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Corpus Nexus
              </h1>
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden md:flex items-center gap-6"></div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4 space-y-3">
              {username && (
                <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">{username}</p>
                </div>
              )}
              <button
                onClick={handleProfileClick}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2 transition-colors"
              >
                <User className="h-4 w-4" />
                {t('common.profile') || 'Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 hover:text-red-900 flex items-center gap-2 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t('common.logout')}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer />

      {/* Floating AI Assistant Button - always visible */}
      <AIAssistantButton />
    </div>
  )
}

export default MainLayout
