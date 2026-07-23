import {
    CalendarDays,
    Clock3,
    Gauge,
    Sparkles,
    Target,
    Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

type SprintPreviewProps = {
    className?: string;
};

const previewStats = [
    {
        label: "Sprint Name",
        value: "Corpus Nexus AI Launch",
        icon: Sparkles,
    },
    {
        label: "Goal",
        value: "Ship a refined onboarding flow and publish the sprint dashboard.",
        icon: Target,
    },
    {
        label: "Duration",
        value: "2 weeks",
        icon: Clock3,
    },
    {
        label: "Estimated Story Points",
        value: "34 pts",
        icon: Gauge,
    },
    {
        label: "Team Members",
        value: "6 contributors",
        icon: Users,
    },
    {
        label: "Timeline Summary",
        value: "Discovery → Build → QA → Release review",
        icon: CalendarDays,
    },
];

export default function SprintPreview({ className }: SprintPreviewProps) {
    return (
        <section
            className={cn(
                "rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur sm:p-6",
                className
            )}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200">
                        <Sparkles className="h-4 w-4" />
                        Sprint Preview
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                        Generated sprint summary
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        A concise, launch-ready preview of the AI-generated sprint brief.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {previewStats.map(({ label, value, icon: Icon }) => (
                    <article
                        key={label}
                        className="rounded-xl border border-white/10 bg-slate-900/80 p-4"
                    >
                        <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
                            <Icon className="h-4 w-4" />
                            {label}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-100">{value}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
