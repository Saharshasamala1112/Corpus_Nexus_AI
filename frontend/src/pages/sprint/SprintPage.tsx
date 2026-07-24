import PageHeader from "@/components/sprint/common/PageHeader";
import SprintNavigation from "@/components/sprint/common/SprintNavigation";
import DashboardHero from "@/components/sprint/dashboard/DashboardHero";
import StatsOverview from "@/components/sprint/dashboard/StatsOverview";
import QuickActions from "@/components/sprint/dashboard/QuickActions";
import RecentProjects from "@/components/sprint/dashboard/RecentProjects";
import ActivityFeed from "@/components/sprint/dashboard/ActivityFeed";

export default function SprintPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="SprintWise AI"
                description="Plan, manage, and generate AI-powered sprints for your engineering teams."
            />

            <SprintNavigation />

            <DashboardHero />

            <StatsOverview />

            <QuickActions />

            <RecentProjects />

            <ActivityFeed />
        </div>
    );
}