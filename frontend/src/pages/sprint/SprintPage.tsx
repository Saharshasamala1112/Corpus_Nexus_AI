import ActivityFeed from "@/components/sprint/dashboard/ActivityFeed";
import DashboardHero from "@/components/sprint/dashboard/DashboardHero";
import QuickActions from "@/components/sprint/dashboard/QuickActions";
import RecentProjects from "@/components/sprint/dashboard/RecentProjects";
import StatsOverview from "@/components/sprint/dashboard/StatsOverview";
import PageHeader from "@/components/sprint/common/PageHeader";

export default function SprintPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="SprintWise AI"
                description="Plan, manage, and generate AI-powered sprints for your engineering teams."
                actionLabel="New Project"
            />

            <DashboardHero />

            <StatsOverview />

            <QuickActions />

            <RecentProjects />

            <ActivityFeed />
        </div>
    );
}