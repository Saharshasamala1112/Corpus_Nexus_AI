import {
    CalendarDays,
    CheckSquare,
    Clock3,
    Users,
} from "lucide-react";

import type { Project } from "@/services/project/types";

type ProjectOverviewCardProps = {
    project: Project;
};

export default function ProjectOverviewCard({
    project,
}: ProjectOverviewCardProps) {
    const taskCount = project.generatedSprint?.tasks.length ?? 0;

    const storyCount = project.generatedSprint?.stories.length ?? 0;

    return (
        <section className="rounded-xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-6">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-semibold text-[var(--app-strong)]">
                        {project.name}
                    </h2>

                    <p className="mt-3 max-w-3xl leading-7 text-[var(--app-text-muted)]">
                        {project.description}
                    </p>
                </div>

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
                    {project.status}
                </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border-[var(--app-border)] bg-[var(--app-surface)] p-4">
                    <div className="flex items-center gap-2 text-[var(--app-text-muted)]">
                        <Users className="h-4 w-4" />
                        Team Members
                    </div>

                    <p className="mt-3 text-2xl font-bold text-[var(--app-strong)]">
                        {project.members?.length ?? 0}
                    </p>
                </div>

                <div className="rounded-lg border-[var(--app-border)] bg-[var(--app-surface)] p-4">
                    <div className="flex items-center gap-2 text-[var(--app-text-muted)]">
                        <Clock3 className="h-4 w-4" />
                        Sprint Duration
                    </div>

                    <p className="mt-3 text-2xl font-bold text-[var(--app-strong)]">
                        {project.sprintDuration} Weeks
                    </p>
                </div>

                <div className="rounded-lg border-[var(--app-border)] bg-[var(--app-surface)] p-4">
                    <div className="flex items-center gap-2 text-[var(--app-text-muted)]">
                        <CheckSquare className="h-4 w-4" />
                        Tasks
                    </div>

                    <p className="mt-3 text-2xl font-bold text-[var(--app-strong)]">
                        {taskCount}
                    </p>
                </div>

                <div className="rounded-lg border-[var(--app-border)] bg-[var(--app-surface)] p-4">
                    <div className="flex items-center gap-2 text-[var(--app-text-muted)]">
                        <CalendarDays className="h-4 w-4" />
                        User Stories
                    </div>

                    <p className="mt-3 text-2xl font-bold text-[var(--app-strong)]">
                        {storyCount}
                    </p>
                </div>
            </div>
        </section>
    );
}