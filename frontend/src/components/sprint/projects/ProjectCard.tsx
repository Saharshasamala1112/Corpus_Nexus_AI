import {
    ArrowRight,
    CheckSquare,
    FolderKanban,
    Pencil,
    Trash2,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Project } from "@/services/project/types";

import { cn } from "@/lib/utils";

type ProjectCardProps = {
    project: Project;
    className?: string;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
};

const statusStyles: Record<Project["status"], string> = {
    Active: "bg-emerald-500/10 text-emerald-200",
    Planning: "bg-amber-500/10 text-amber-200",
    Completed: "bg-cyan-500/10 text-cyan-200",
};

export default function ProjectCard({
    project,
    className,
    onEdit,
    onDelete,
}: ProjectCardProps) {
    const navigate = useNavigate();

    const taskCount = project.generatedSprint?.tasks.length ?? 0;
    const memberCount = project.members?.length ?? 0;

    const lastUpdated = new Date(project.updatedAt).toLocaleDateString();

    function handleOpenProject() {
        navigate(`/sprintwise-ai/projects/${project.id}`);
    }

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={handleOpenProject}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleOpenProject();
                }
            }}
            className={cn(
                "group cursor-pointer rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50",
                className
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="rounded-lg bg-cyan-500/15 p-2.5 text-cyan-300">
                    <FolderKanban className="h-5 w-5" />
                </div>

                <span
                    className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        statusStyles[project.status]
                    )}
                >
                    {project.status}
                </span>
            </div>

            <div className="mt-4">
                <h3 className="text-base font-semibold text-white">
                    {project.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">
                    {project.description}
                </p>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{memberCount}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4" />
                    <span>{taskCount}</span>
                </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                        Last updated {lastUpdated}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(project);
                            }}
                            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-cyan-300"
                            title="Edit Project"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(project);
                            }}
                            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                            title="Delete Project"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-2 text-slate-500 transition-colors group-hover:text-cyan-300">
                            <span className="text-sm font-medium">
                                View
                            </span>

                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}