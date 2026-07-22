import { Outlet } from 'react-router-dom'
import AIAssistantButton from '@/components/ai-assistant/AIAssistantButton'

function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen">
        <Outlet />
      </main>
      <AIAssistantButton />
    </div>
  )
}

export default MainLayout
