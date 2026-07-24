import { Navigate, Route, Routes } from "react-router-dom";

import AskCorpusPage from "../pages/askCorpus/AskCorpusPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import CorpusGuardPage from "../pages/corpusGuard/CorpusGuardPage";
import CorpusInsightsPage from "../pages/corpusInsights/CorpusInsightsPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import OnboardingPage from "../pages/onboarding/OnboardingPage";
import TaskDetailsPage from "../pages/onboarding/TaskDetailsPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";
import SprintPage from "../pages/sprint/SprintPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/corpus-insights" element={<ProtectedRoute><CorpusInsightsPage /></ProtectedRoute>} />
            <Route path="/ask-corpus" element={<ProtectedRoute><AskCorpusPage /></ProtectedRoute>} />
            <Route path="/sprintwise-ai" element={<ProtectedRoute><SprintPage /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/onboarding/task/:id" element={<ProtectedRoute><TaskDetailsPage /></ProtectedRoute>} />
            <Route path="/corpusguard" element={<ProtectedRoute><CorpusGuardPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
    );
}

export default AppRoutes;