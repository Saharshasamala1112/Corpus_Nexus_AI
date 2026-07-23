import { Link, useParams } from "react-router-dom";
import { onboardingTasks } from "./data/onboardingTasks";

function TaskDetailsPage() {
    const { id } = useParams();

    const task = onboardingTasks.find(
        (task) => task.id === Number(id)
    );

    if (!task) {
        return (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-10">
                <h2 className="text-2xl font-semibold text-white">
                    Task not found
                </h2>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-10 shadow-2xl shadow-black/20">
            <Link
                to="/onboarding"
                className="text-violet-400 hover:text-violet-300"
            >
                ← Back to Checklist
            </Link>

            <p className="mt-8 text-sm font-medium uppercase tracking-[0.35em] text-violet-400">
                Onboarding Task
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-white">
                {task.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400">
                {task.description}
            </p>

            <a
                href="https://code.swecha.org/internships/intern-instructions/-/blob/main/workbench-setup.md"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-3 text-sm font-medium text-violet-300 hover:bg-violet-500/20"
            >
                Open Official Workbench Guide
            </a>
        </div>
    );
}

export default TaskDetailsPage;