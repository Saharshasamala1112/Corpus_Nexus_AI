import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import AIAssistantButton from '@/components/ai-assistant/AIAssistantButton'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Settings, LogOut, User, Menu, X } from 'lucide-react'

function MainLayout() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const hideFAB = location.pathname === '/ai-assistant'
  const username = localStorage.getItem('username')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('phone')
    setIsMenuOpen(false)
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
            <div className="hidden md:flex items-center gap-6">
              <LanguageSwitcher />

              {/* Settings & Profile Menu */}
              <div className="relative group">
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <Settings className="h-4 w-4" />
                  <span>{t('common.settings') || 'Settings'}</span>
                </button>

                <div className="absolute right-0 z-50 mt-2 hidden w-48 rounded-lg border border-slate-200 bg-white shadow-lg group-hover:block">
                  <div className="p-2">
                    {username && (
                      <div className="px-3 py-2 border-b border-slate-100 mb-2">
                        <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{username}</p>
                      </div>
                    )}
                    <button
                      onClick={handleProfileClick}
                      className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      {t('common.profile') || 'Profile'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50 hover:text-red-900 flex items-center gap-2 border-t border-slate-100 mt-2 pt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('common.logout')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
              <div className="px-2">
                <LanguageSwitcher />
              </div>
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

      {/* Improved AI Assistant Button */}
      {!hideFAB && <AIAssistantButton />}
    </div>
  )
}

export default MainLayout
