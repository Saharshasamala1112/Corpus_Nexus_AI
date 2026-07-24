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
        <section className="rounded-xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        {project.name}
                    </h2>

                    <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                        {project.description}
                    </p>
                </div>

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
                    {project.status}
                </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Users className="h-4 w-4" />
                        Team Members
                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                        {project.members.length}
                    </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Clock3 className="h-4 w-4" />
                        Sprint Duration
                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                        {project.sprintDuration} Weeks
                    </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <CheckSquare className="h-4 w-4" />
                        Tasks
                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                        {taskCount}
                    </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <CalendarDays className="h-4 w-4" />
                        User Stories
                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                        {storyCount}
                    </p>
                </div>
            </div>
        </section>
    );
}