import { Navigate, Route, Routes } from "react-router-dom";

import AskCorpusPage from "../pages/askCorpus/AskCorpusPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
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
import TaskDetailsPage from "../pages/onboarding/TaskDetailsPage";
import ExistingProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";

import SprintPage from "../pages/sprint/SprintPage";
import Projects from "../pages/sprint/Projects";
import ProjectDetails from "../pages/sprint/ProjectDetails";
import SprintGenerator from "../pages/sprint/SprintGenerator";
import Team from "../pages/sprint/Team";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPasswordPage />}
            />

            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/corpus-insights"
                element={
                    <ProtectedRoute>
                        <CorpusInsightsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/ask-corpus"
                element={
                    <ProtectedRoute>
                        <AskCorpusPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/corpus-explorer"
                element={
                    <ProtectedRoute>
                        <CorpusExplorerPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/corpus-explorer/search"
                element={
                    <ProtectedRoute>
                        <SearchPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/corpus-explorer/record/:uid"
                element={
                    <ProtectedRoute>
                        <RecordDetailsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/corpus-explorer/languages"
                element={
                    <ProtectedRoute>
                        <LanguagesPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/corpus-explorer/categories"
                element={
                    <ProtectedRoute>
                        <CategoriesPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/corpus-explorer/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/sprintwise-ai"
                element={
                    <ProtectedRoute>
                        <SprintPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/sprintwise-ai/projects"
                element={
                    <ProtectedRoute>
                        <Projects />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/sprintwise-ai/projects/:projectId"
                element={
                    <ProtectedRoute>
                        <ProjectDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/sprintwise-ai/team"
                element={
                    <ProtectedRoute>
                        <Team />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/sprintwise-ai/generator"
                element={
                    <ProtectedRoute>
                        <SprintGenerator />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute>
                        <OnboardingPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/onboarding/task/:id"
                element={
                    <ProtectedRoute>
                        <TaskDetailsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/corpusguard"
                element={
                    <ProtectedRoute>
                        <CorpusGuardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ExistingProfilePage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;