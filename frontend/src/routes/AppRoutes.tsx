import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import DashboardPage from '@/pages/dashboard'
import AIAssistantPage from '@/pages/ai-assistant'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="ai-assistant" element={<AIAssistantPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
