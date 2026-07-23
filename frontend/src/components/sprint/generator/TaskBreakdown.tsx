import { ArrowRight, CircleDashed, ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";

type TaskItem = {
    title: string;
    priority: string;
    storyPoints: string;
    assignee: string;
    status: string;
};

type TaskBreakdownProps = {
    className?: string;
};

const tasks: TaskItem[] = [
    {
        title: "Refine onboarding flow copy",
        priority: "High",
        storyPoints: "5 pts",
        assignee: "Maya",
        status: "In Progress",
    },
    {
        title: "Implement sprint dashboard widget",
        priority: "High",
        storyPoints: "8 pts",
        assignee: "Liam",
        status: "Planned",
    },
    {
        title: "Validate release checklist",
        priority: "Medium",
        storyPoints: "3 pts",
        assignee: "Isha",
        status: "Ready",
    },
    {
        title: "QA accessibility pass",
        priority: "Medium",
        storyPoints: "5 pts",
        assignee: "Noah",
        status: "Blocked",
    },
];

const statusStyles: Record<string, string> = {
    "In Progress": "bg-cyan-500/15 text-cyan-200 border-cyan-400/20",
    Planned: "bg-slate-700/60 text-slate-100 border-white/10",
    Ready: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
    Blocked: "bg-rose-500/15 text-rose-200 border-rose-400/20",
};

export default function TaskBreakdown({ className }: TaskBreakdownProps) {
    return (
        <section
            className={cn(
                "rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur sm:p-6",
                className
            )}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200">
                        <ListChecks className="h-4 w-4" />
                        Task Breakdown
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                        Sprint workstream summary
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Placeholder task list for a generated sprint plan.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid gap-4">
                {tasks.map((task) => (
                    <article
                        key={task.title}
                        className="rounded-xl border border-white/10 bg-slate-900/80 p-4"
                    >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-full bg-cyan-500/10 p-1.5 text-cyan-300">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                                        <span className="rounded-full border border-white/10 bg-slate-800 px-2.5 py-1">
                                            Priority: {task.priority}
                                        </span>
                                        <span className="rounded-full border border-white/10 bg-slate-800 px-2.5 py-1">
                                            Story points: {task.storyPoints}
                                        </span>
                                        <span className="rounded-full border border-white/10 bg-slate-800 px-2.5 py-1">
                                            Assignee: {task.assignee}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
                                    statusStyles[task.status]
                                )}
                            >
                                <CircleDashed className="h-3.5 w-3.5" />
                                {task.status}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
