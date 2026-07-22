import { Link } from "react-router-dom";

interface SprintProjectCardProps {
    id: string;
    name: string;
    description: string;
    sprintDuration: number;
    teamSize: number;
    onGenerate: (projectId: string) => void;
    generating: boolean;
}

export default function SprintProjectCard({
    id,
    name,
    description,
    sprintDuration,
    teamSize,
    onGenerate,
    generating,
}: SprintProjectCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{name}</h2>

                <p className="mt-2 text-slate-500">{description}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4 text-blue-600"
                        aria-hidden="true"
                    >
                        <rect x="3" y="4" width="18" height="17" rx="2" />
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <path d="M3 10h18" />
                    </svg>
                    <span>{sprintDuration} Week Sprint</span>
                </div>

                <div className="flex items-center gap-2">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4 text-green-600"
                        aria-hidden="true"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                        <circle cx="9.5" cy="7" r="3" />
                        <path d="M17 8a3 3 0 1 1 0 6" />
                        <path d="M17 14v2" />
                    </svg>
                    <span>{teamSize} Team Members</span>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
                <button
                    onClick={() => onGenerate(id)}
                    disabled={generating}
                    className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {generating ? "Generating..." : "Generate Sprint"}
                </button>

                <Link
                    to={`/projects/${id}`}
                    className="rounded-xl border border-blue-600 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                    View Project
                </Link>
            </div>
        </div>
    );
}
