import { useMemo } from "react";

import ProgressSummary from "./components/ProgressSummary";
import TaskCard from "./components/TaskCard";
import { onboardingTasks } from "./data/onboardingTasks";
import { getProgress } from "./utils/taskStorage";

function OnboardingPage() {
    const progressData = getProgress();

    const tasks = useMemo(() => {
        return onboardingTasks.map((task) => ({
            ...task,
            status: progressData[task.id]?.completed
                ? "Completed"
                : "Pending",
        }));
    }, [progressData]);

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const pendingTasks = tasks.length - completedTasks;

    const progress =
        tasks.length === 0
            ? 0
            : Math.round((completedTasks / tasks.length) * 100);

    return (
        <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-10 shadow-[var(--shadow-lg)] dark:border-zinc-800 dark:bg-zinc-950/70 dark:shadow-black/20">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-400">
                Onboarding
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-strong)] dark:text-white">
                Onboarding Companion
            </h1>

            <p className="mt-3 max-w-2xl text-base text-[var(--app-text-muted)] dark:text-zinc-400">
                Complete the required onboarding tasks to prepare your development
                environment and begin contributing to the project.
            </p>

            <div className="mt-8 space-y-6">
                <ProgressSummary
                    totalTasks={tasks.length}
                    completedTasks={completedTasks}
                    pendingTasks={pendingTasks}
                    progress={progress}
                />

                <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-6 dark:border-zinc-800 dark:bg-zinc-900/70">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--app-strong)] dark:text-white">
                                Checklist
                            </h2>

                            <p className="mt-1 text-sm text-[var(--app-text-muted)] dark:text-zinc-400">
                                Work through the setup tasks to prepare your workspace.
                            </p>
                        </div>

                        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
                            {completedTasks}/{tasks.length} done
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                status={task.status}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OnboardingPage;