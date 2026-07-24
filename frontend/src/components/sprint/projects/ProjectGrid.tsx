import ProjectCard from "./ProjectCard";

import type { Project } from "@/services/project/types";

import { cn } from "@/lib/utils";

type ProjectGridProps = {
    className?: string;
    projects: Project[];
    onProjectsChange: React.Dispatch<React.SetStateAction<Project[]>>;
};

export default function ProjectGrid({
    className,
    projects,
}: ProjectGridProps) {
    if (projects.length === 0) {
        return (
            <section
                className={cn(
                    "flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/40",
                    className
                )}
            >
                <div className="space-y-2 text-center">
                    <h3 className="text-lg font-semibold text-slate-200">
                        No Projects Yet
                    </h3>

                    <p className="text-sm text-slate-400">
                        Create your first project to start planning sprints.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            className={cn(
                "grid gap-6 md:grid-cols-2 xl:grid-cols-3",
                className
            )}
        >
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                />
            ))}
        </section>
    );
}