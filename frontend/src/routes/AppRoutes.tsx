import { Navigate, Route, Routes } from "react-router-dom";

import AskCorpusPage from "../pages/askCorpus/AskCorpusPage";
import CategoriesPage from "../pages/corpusExplorer/CategoriesPage";
import CorpusExplorerPage from "../pages/corpusExplorer/CorpusExplorerPage";
import LanguagesPage from "../pages/corpusExplorer/LanguagesPage";
import ProfilePage from "../pages/corpusExplorer/ProfilePage";
import RecordDetailsPage from "../pages/corpusExplorer/RecordDetailsPage";
import SearchPage from "../pages/corpusExplorer/SearchPage";
import CorpusGuardPage from "../pages/corpusGuard/CorpusGuardPage";
import CorpusInsightsPage from "../pages/corpusInsights/CorpusInsightsPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import OnboardingPage from "../pages/onboarding/OnboardingPage";
import SettingsPage from "../pages/settings/SettingsPage";
import SprintPage from "../pages/sprint/SprintPage";
import ExistingProfilePage from "../pages/profile/ProfilePage";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/corpus-insights" element={<CorpusInsightsPage />} />
            <Route path="/ask-corpus" element={<AskCorpusPage />} />

            <Route path="/corpus-explorer" element={<CorpusExplorerPage />} />
            <Route path="/corpus-explorer/search" element={<SearchPage />} />
            <Route path="/corpus-explorer/record/:id" element={<RecordDetailsPage />} />
            <Route path="/corpus-explorer/languages" element={<LanguagesPage />} />
            <Route path="/corpus-explorer/categories" element={<CategoriesPage />} />
            <Route path="/corpus-explorer/profile" element={<ProfilePage />} />

            <Route path="/sprintwise-ai" element={<SprintPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/corpusguard" element={<CorpusGuardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ExistingProfilePage />} />
        </Routes>
    );
}

export default AppRoutes;