import { ArrowRight, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectGridProps = {
    className?: string;
};

export default function ProjectGrid({ className }: ProjectGridProps) {
    const navigate = useNavigate();

    return (
        <section className={cn("w-full", className)}>
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                    <FolderKanban className="h-8 w-8" />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                    No projects yet
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
                    Create your first project to start planning AI-powered
                    sprints, organize your work, and collaborate with your team.
                </p>

                <Button
                    className="mt-6"
                    onClick={() => navigate("/sprintwise-ai/projects")}
                >
                    Create Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </section>
    );
}