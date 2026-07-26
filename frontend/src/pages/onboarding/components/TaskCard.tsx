import { useNavigate } from "react-router-dom";

type TaskCardProps = {
    id: number;
    title: string;
    status: string;
};

function TaskCard({ id, title, status }: TaskCardProps) {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-5 transition hover:border-violet-500/40 hover:bg-[var(--app-surface)] dark:border-zinc-800 dark:bg-zinc-950/70 dark:hover:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-[var(--app-strong)] dark:text-white">
                        {title}
                    </h3>

                    <p className="mt-2 text-sm text-[var(--app-text-muted)] dark:text-zinc-400">
                        Follow the guided setup for this onboarding step.
                    </p>
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${status === "Completed"
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                        }`}
                >
                    {status}
                </span>
            </div>

            <button
                onClick={() => navigate(`/onboarding/task/${id}`)}
                className="mt-5 inline-flex items-center rounded-full border border-[var(--app-accent)]/30 bg-[var(--app-accent-soft)] px-3.5 py-2 text-sm font-medium text-[var(--app-accent)] transition hover:bg-[var(--app-accent)]/20 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20"
            >
                {status === "Completed" ? "View" : "Start"}
            </button>
        </div>
    );
}

export default TaskCard;