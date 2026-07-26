import { ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SprintResult } from "@/services/sprintGenerator/types";

type TaskBreakdownProps = {
    className?: string;
    sprint: SprintResult | null;
};

export default function TaskBreakdown({
    className,
    sprint,
}: TaskBreakdownProps) {
    if (!sprint) {
        return (
            <section
                className={cn(
                    "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--shadow-sm)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                    className
                )}
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-accent)]/20 bg-[var(--app-accent-soft)] px-3 py-1 text-sm font-medium text-[var(--app-accent)] dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200">
                    <ListChecks className="h-4 w-4" />
                    Task Breakdown
                </div>

                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                    <div className="rounded-2xl bg-[var(--app-accent-soft)] p-5 text-[var(--app-accent)] dark:bg-violet-500/10 dark:text-violet-300">
                        <ListChecks className="h-10 w-10" />
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold text-[var(--app-strong)] dark:text-white">
                        No tasks generated yet
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[var(--app-text-muted)] dark:text-slate-400">
                        Once a sprint is generated, the AI-created task
                        breakdown, priorities, and work items will appear here.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            className={cn(
                "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 backdrop-blur dark:border-white/10 dark:bg-slate-950/70",
                className
            )}
        >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-accent)]/20 bg-[var(--app-accent-soft)] px-3 py-1 text-sm font-medium text-[var(--app-accent)] dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200">
                <ListChecks className="h-4 w-4" />
                Task Breakdown
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-2">
                <div>
                    <h2 className="text-lg font-semibold text-[var(--app-strong)] dark:text-white">
                        Tasks
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--app-text-soft)] dark:text-slate-300">
                        {sprint.tasks.map((task, index) => (
                            <li key={index}>{task}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-[var(--app-strong)] dark:text-white">
                        Task Assignments
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--app-text-soft)] dark:text-slate-300">
                        {sprint.assignments.map((assignment, index) => (
                            <li key={index}>{assignment}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}