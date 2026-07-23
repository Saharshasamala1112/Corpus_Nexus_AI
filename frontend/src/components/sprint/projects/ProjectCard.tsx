import { ArrowRight, CheckSquare, FolderKanban, Users } from "lucide-react";

import { cn } from "@/lib/utils";

type ProjectCardProps = {
    name: string;
    description: string;
    status: "Active" | "Planning" | "Completed";
    members: number;
    tasks: number;
    lastUpdated: string;
    className?: string;
};

const statusStyles: Record<ProjectCardProps["status"], string> = {
    Active: "bg-emerald-500/10 text-emerald-200",
    Planning: "bg-amber-500/10 text-amber-200",
    Completed: "bg-cyan-500/10 text-cyan-200",
};

export default function ProjectCard({
    name,
    description,
    status,
    members,
    tasks,
    lastUpdated,
    className,
}: ProjectCardProps) {
    return (
        <article
            className={cn(
                "group rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/10",
                className
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="rounded-lg bg-cyan-500/15 p-2.5 text-cyan-300">
                    <FolderKanban className="h-5 w-5" />
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[status])}>
                    {status}
                </span>
            </div>

            <div className="mt-4">
                <h3 className="text-base font-semibold text-white">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{members}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4" />
                    <span>{tasks}</span>
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                <span className="text-slate-500">Last updated {lastUpdated}</span>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-300" />
            </div>
        </article>
    );
}
