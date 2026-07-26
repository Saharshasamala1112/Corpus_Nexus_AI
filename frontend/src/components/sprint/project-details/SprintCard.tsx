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
        <section className="rounded-xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--app-strong)]">
                    Sprint
                </h3>

                {sprint && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        Generated
                    </span>
                )}
            </div>

            {!sprint ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-dashed border-[var(--app-border)] py-10 text-center">
                    <CheckSquare className="h-10 w-10 text-[var(--app-text-muted)]" />

                    <h4 className="mt-4 text-lg font-medium text-[var(--app-strong)]">
                        No Sprint Generated
                    </h4>

                    <p className="mt-2 max-w-sm text-sm text-[var(--app-text-muted)]">
                        Generate an AI-powered sprint for this project using
                        SprintWise AI.
                    </p>

                    <button
                        type="button"
                        onClick={onGenerateSprint}
                        disabled={generating}
                        className="mt-6 inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-[var(--app-surface)] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {generating ? "Generating..." : "Generate Sprint"}
                    </button>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                            Sprint Goal
                        </h4>

                        <p className="mt-2 leading-7 text-[var(--app-text)]">
                            {sprint.goal}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                            Acceptance Criteria
                        </h4>

                        <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--app-text)]">
                            {sprint.acceptance.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-[var(--app-border)] pt-5">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
                                Stories
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-[var(--app-strong)]">
                                {sprint.stories.length}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
                                Tasks
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-[var(--app-strong)]">
                                {sprint.tasks.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}