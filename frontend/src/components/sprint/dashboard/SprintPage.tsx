import DashboardHero from "@/components/sprint/DashboardHero";
import StatsCards from "@/components/sprint/StatsCards";

export default function SprintPage() {
    return (
        <div className="space-y-8">
            <DashboardHero />
            <StatsCards />
        </div>
    );
}