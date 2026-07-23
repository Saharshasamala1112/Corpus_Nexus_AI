import {
    Bot,
    CheckCircle2,
    PlusCircle,
    Sparkles,
    UserPlus,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ActivityFeedProps = {
    className?: string;
};

type ActivityItem = {
    user: string;
    action: string;
    project: string;
    timestamp: string;
    icon: LucideIcon;
    accent: string;
};

const activities: ActivityItem[] = [
    {
        user: "Meghana",
        action: "created",
        project: "Project Atlas",
        timestamp: "2m ago",
        icon: PlusCircle,
        accent: "bg-cyan-500/15 text-cyan-300",
    },
    {
        user: "Rahul",
        action: "generated",
        project: "AI Sprint",
        timestamp: "18m ago",
        icon: Sparkles,
        accent: "bg-violet-500/15 text-violet-300",
    },
    {
        user: "Sarah",
        action: "completed",
        project: "Sprint Planning",
        timestamp: "1h ago",
        icon: CheckCircle2,
        accent: "bg-emerald-500/15 text-emerald-300",
    },
    {
        user: "Team Phoenix",
        action: "invited",
        project: "3 new members",
        timestamp: "3h ago",
        icon: UserPlus,
        accent: "bg-amber-500/15 text-amber-300",
    },
    {
        user: "AI",
        action: "suggested",
        project: "12 backlog improvements",
        timestamp: "5h ago",
        icon: Bot,
        accent: "bg-fuchsia-500/15 text-fuchsia-300",
    },
];

export default function ActivityFeed({ className }: ActivityFeedProps) {
    return (
        <section className={cn("w-full", className)}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                    Recent Activity
                </h3>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:p-5">
                <ul className="space-y-0">
                    {activities.map((activity, index) => {
                        const Icon = activity.icon;

                        return (
                            <li
                                key={`${activity.user}-${activity.project}`}
                                className={cn(
                                    "flex items-start gap-3 py-3",
                                    index < activities.length - 1 && "border-b border-white/10"
                                )}
                            >
                                <div className={cn("mt-0.5 rounded-full p-2.5", activity.accent)}>
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-slate-200">
                                        <span className="font-medium text-white">{activity.user}</span>{" "}
                                        <span className="text-slate-400">{activity.action}</span>{" "}
                                        <span className="font-medium text-cyan-300">{activity.project}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {activity.timestamp}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
