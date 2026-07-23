import {
    Activity,
    FolderKanban,
    Sparkles,
    Users,
} from "lucide-react";

import StatsCard from "@/components/sprint/common/StatsCard";

const stats = [
    {
        title: "Projects",
        value: "24",
        subtitle: "Active initiatives",
        trend: "+12%",
        icon: <FolderKanban className="h-5 w-5" />,
        color: "cyan" as const,
    },
    {
        title: "Team Members",
        value: "18",
        subtitle: "Cross-functional crew",
        trend: "+4",
        icon: <Users className="h-5 w-5" />,
        color: "violet" as const,
    },
    {
        title: "AI Sprints",
        value: "9",
        subtitle: "Automated workflows",
        trend: "Live",
        icon: <Sparkles className="h-5 w-5" />,
        color: "emerald" as const,
    },
    {
        title: "Velocity",
        value: "87%",
        subtitle: "Delivery confidence",
        trend: "+8%",
        icon: <Activity className="h-5 w-5" />,
        color: "amber" as const,
    },
];

export default function StatsOverview() {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <StatsCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    subtitle={stat.subtitle}
                    trend={stat.trend}
                    icon={stat.icon}
                    color={stat.color}
                />
            ))}
        </section>
    );
}
