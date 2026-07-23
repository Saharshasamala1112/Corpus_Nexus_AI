import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AIAssistantButton from '@/components/ai-assistant/AIAssistantButton'
import LanguageSwitcher from '@/components/LanguageSwitcher'

function MainLayout() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const hideFAB = location.pathname === '/ai-assistant'
  const username = localStorage.getItem('username')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('phone')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-slate-800">Corpus Nexus AI</h1>
          <div className="flex items-center gap-4">
            {username && (
              <span className="text-sm text-slate-600">
                {t('auth.welcome')}, {username}
              </span>
            )}
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </header>
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!hideFAB && <AIAssistantButton />}
    </div>
  )
}

export default MainLayout
