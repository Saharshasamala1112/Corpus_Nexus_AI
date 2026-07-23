import { ArrowRight, CheckSquare, FolderKanban, Users } from "lucide-react";

import { cn } from "@/lib/utils";

type RecentProjectsProps = {
    className?: string;
};

type ProjectItem = {
    name: string;
    description: string;
    status: "Active" | "Planning" | "Completed";
    members: number;
    tasks: number;
    updatedAt: string;
};

const projects: ProjectItem[] = [
    {
        name: "AI Sprint Planner",
        description: "Coordinate sprint goals and generated task flows.",
        status: "Active",
        members: 8,
        tasks: 24,
        updatedAt: "2h ago",
    },
    {
        name: "Launch Readiness",
        description: "Prepare rollout milestones and stakeholder alignment.",
        status: "Planning",
        members: 5,
        tasks: 13,
        updatedAt: "5h ago",
    },
    {
        name: "Automation Ops",
        description: "Track delivery automations and cross-team dependencies.",
        status: "Completed",
        members: 6,
        tasks: 31,
        updatedAt: "1d ago",
    },
    {
        name: "Client Insights",
        description: "Surface feedback loops and AI-generated reporting themes.",
        status: "Active",
        members: 4,
        tasks: 17,
        updatedAt: "3d ago",
    },
];

const statusStyles: Record<ProjectItem["status"], string> = {
    Active: "bg-emerald-500/10 text-emerald-200",
    Planning: "bg-amber-500/10 text-amber-200",
    Completed: "bg-cyan-500/10 text-cyan-200",
};

export default function RecentProjects({ className }: RecentProjectsProps) {
    return (
        <section className={cn("w-full", className)}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                    Recent Projects
                </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                    <article
                        key={project.name}
                        className="group rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="rounded-lg bg-cyan-500/15 p-2.5 text-cyan-300">
                                <FolderKanban className="h-5 w-5" />
                            </div>
                            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[project.status])}>
                                {project.status}
                            </span>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-base font-semibold text-white">{project.name}</h4>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {project.description}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4" />
                                <span>{project.members}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckSquare className="h-4 w-4" />
                                <span>{project.tasks}</span>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                            <span className="text-slate-500">Last updated {project.updatedAt}</span>
                            <ArrowRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-300" />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
