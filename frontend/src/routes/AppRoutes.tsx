import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import DashboardPage from '@/pages/dashboard'
import AIAssistantPage from '@/pages/ai-assistant'
import Profile from '@/pages/explorer/Profile'
import Search from '@/pages/explorer/Search'
import RecordDetails from '@/pages/explorer/RecordDetails'
import OnboardingPage from '../pages/onboarding/index'
import TaskDetails from '../pages/onboarding/TaskDetails'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="ai-assistant" element={<AIAssistantPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="search" element={<Search />} />
        <Route path="record/:id" element={<RecordDetails />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="onboarding/:id" element={<TaskDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
