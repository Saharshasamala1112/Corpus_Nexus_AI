import { CheckSquare } from "lucide-react";

import type { Project } from "@/services/project/types";

type SprintCardProps = {
    project: Project;
    onGenerateSprint: () => void;
    generating?: boolean;
};

export default function SprintCard({
    project,
    onGenerateSprint,
    generating = false,
}: SprintCardProps) {
    const sprint = project.generatedSprint;

    return (
        <section className="rounded-xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    Sprint
                </h3>

                {sprint && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        Generated
                    </span>
                )}
            </div>

            {!sprint ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 py-10 text-center">
                    <CheckSquare className="h-10 w-10 text-slate-500" />

                    <h4 className="mt-4 text-lg font-medium text-white">
                        No Sprint Generated
                    </h4>

                    <p className="mt-2 max-w-sm text-sm text-slate-400">
                        Generate an AI-powered sprint for this project using
                        SprintWise AI.
                    </p>

                    <button
                        type="button"
                        onClick={onGenerateSprint}
                        disabled={generating}
                        className="mt-6 inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {generating ? "Generating..." : "Generate Sprint"}
                    </button>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                            Sprint Goal
                        </h4>

                        <p className="mt-2 leading-7 text-slate-300">
                            {sprint.goal}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                            Acceptance Criteria
                        </h4>

                        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                            {sprint.acceptance.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Stories
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-white">
                                {sprint.stories.length}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Tasks
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-white">
                                {sprint.tasks.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}