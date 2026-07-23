type Task = {
    title: string;
    status: string;
};

function StatItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-white">{value}</p>
        </div>
    );
}

function TaskCard({ title, status }: Task) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:border-violet-500/40 hover:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">Follow the guided setup for this onboarding step.</p>
                </div>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-300">
                    {status}
                </span>
            </div>
            <button className="mt-5 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20">
                Start
            </button>
        </div>
    );
}

function OnboardingPage() {
    const tasks: Task[] = [
        { title: 'Install Linux Environment', status: 'Pending' },
        { title: 'Configure Git & GitLab', status: 'Pending' },
        { title: 'Setup Docker', status: 'Pending' },
        { title: 'Install Development Tools', status: 'Pending' },
        { title: 'Verify Development Environment', status: 'Pending' }
    ];

    const completedTasks = 0;
    const pendingTasks = tasks.length - completedTasks;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-10 shadow-2xl shadow-black/20">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-400">Onboarding</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Onboarding companion</h1>
            <p className="mt-3 max-w-2xl text-base text-zinc-400">Complete the required onboarding tasks to prepare your development environment and begin contributing to the project.</p>

            <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-400">Progress summary</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <StatItem label="Total Tasks" value={tasks.length.toString()} />
                                <StatItem label="Completed Tasks" value={completedTasks.toString()} />
                                <StatItem label="Pending Tasks" value={pendingTasks.toString()} />
                            </div>
                        </div>

                        <div className="w-full max-w-sm">
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-zinc-400">Progress</span>
                                <span className="font-medium text-white">{progress}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-800">
                                <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Checklist</h2>
                            <p className="mt-1 text-sm text-zinc-400">Work through the setup tasks to prepare your workspace.</p>
                        </div>
                        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
                            {completedTasks}/{tasks.length} done
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {tasks.map((task) => (
                            <TaskCard key={task.title} title={task.title} status={task.status} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OnboardingPage;
