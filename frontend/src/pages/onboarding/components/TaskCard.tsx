import { useNavigate } from "react-router-dom";

type TaskCardProps = {
    id: number;
    title: string;
    status: string;
};

function TaskCard({ id, title, status }: TaskCardProps) {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:border-violet-500/40 hover:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-white">
                        {title}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-400">
                        Follow the guided setup for this onboarding step.
                    </p>
                </div>

                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-300">
                    {status}
                </span>
            </div>

            <button
                onClick={() => navigate(`/onboarding/task/${id}`)}
                className="mt-5 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
            >
                Start
            </button>
        </div>
    );
}

export default TaskCard;