import ProgressSummary from "./components/ProgressSummary";
import TaskCard from "./components/TaskCard";
import { onboardingTasks } from "./data/onboardingTasks";

function OnboardingPage() {
    const completedTasks = 0;

    const pendingTasks = onboardingTasks.length - completedTasks;

    const progress = Math.round(
        (completedTasks / onboardingTasks.length) * 100
    );

    return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-10 shadow-2xl shadow-black/20">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-400">
                Onboarding
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                Onboarding Companion
            </h1>

            <p className="mt-3 max-w-2xl text-base text-zinc-400">
                Complete the required onboarding tasks to prepare your
                development environment and begin contributing to the project.
            </p>

            <div className="mt-8 space-y-6">
                <ProgressSummary
                    totalTasks={onboardingTasks.length}
                    completedTasks={completedTasks}
                    pendingTasks={pendingTasks}
                    progress={progress}
                />

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Checklist
                            </h2>

                            <p className="mt-1 text-sm text-zinc-400">
                                Work through the setup tasks to prepare your workspace.
                            </p>
                        </div>

                        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
                            {completedTasks}/{onboardingTasks.length} done
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {onboardingTasks.map((task) => (
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