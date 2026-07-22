import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import DashboardPage from '@/pages/dashboard'
import AIAssistantPage from '@/pages/ai-assistant'
import Login from '@/pages/explorer/login'
import Profile from '@/pages/explorer/profile'
import Search from '@/pages/explorer/Search'
import RecordDetails from '@/pages/explorer/RecordDetails'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="ai-assistant" element={<AIAssistantPage />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="search" element={<Search />} />
        <Route path="record/:id" element={<RecordDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
