import { Navigate, Route, Routes } from "react-router-dom";
import AskCorpusPage from "../pages/askCorpus/AskCorpusPage";
import CorpusGuardPage from "../pages/corpusGuard/CorpusGuardPage";
import CorpusInsightsPage from "../pages/corpusInsights/CorpusInsightsPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import OnboardingPage from "../pages/onboarding/OnboardingPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";
import SprintPage from "../pages/sprint/SprintPage";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/corpus-insights" element={<CorpusInsightsPage />} />
            <Route path="/ask-corpus" element={<AskCorpusPage />} />
            <Route path="/sprintwise-ai" element={<SprintPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/corpusguard" element={<CorpusGuardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
}

export default AppRoutes;