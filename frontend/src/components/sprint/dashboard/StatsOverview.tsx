import {
    Activity,
    FolderKanban,
    Sparkles,
    Users,
} from "lucide-react";

import StatsCard from "@/components/sprint/common/StatsCard";
import { useDashboard } from "@/hooks/useDashboard";

export default function StatsOverview() {
    const { stats, loading } = useDashboard();

    const cards = [
        {
            title: "Projects",
            value: loading ? "..." : String(stats.projects),
            subtitle:
                stats.projects === 0
                    ? "No active projects"
                    : `${stats.projects} active project${stats.projects > 1 ? "s" : ""
                    }`,
            trend: "",
            icon: <FolderKanban className="h-5 w-5" />,
            color: "cyan" as const,
        },
        {
            title: "Team Members",
            value: loading ? "..." : String(stats.members),
            subtitle:
                stats.members === 0
                    ? "Invite your team"
                    : `${stats.members} team member${stats.members > 1 ? "s" : ""
                    }`,
            trend: "",
            icon: <Users className="h-5 w-5" />,
            color: "violet" as const,
        },
        {
            title: "Sprint Plans",
            value: loading ? "..." : String(stats.sprint_plans),
            subtitle:
                stats.sprint_plans === 0
                    ? "Generate your first sprint"
                    : `${stats.sprint_plans} sprint plan${stats.sprint_plans > 1 ? "s" : ""
                    }`,
            trend: "",
            icon: <Sparkles className="h-5 w-5" />,
            color: "emerald" as const,
        },
        {
            title: "Velocity",
            value: "--",
            subtitle: "Available after your first sprint",
            trend: "",
            icon: <Activity className="h-5 w-5" />,
            color: "amber" as const,
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatsCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    subtitle={card.subtitle}
                    trend={card.trend}
                    icon={card.icon}
                    color={card.color}
                />
            ))}
        </section>
    );
}