import { Outlet, useLocation } from 'react-router-dom'
import AIAssistantButton from '@/components/ai-assistant/AIAssistantButton'

function MainLayout() {
  const location = useLocation()
  const hideFAB = location.pathname === '/ai-assistant'

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!hideFAB && <AIAssistantButton />}
    </div>
  )
}

export default MainLayout
