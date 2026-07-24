import { ArrowRight, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RecentProjectsProps = {
    className?: string;
};

export default function RecentProjects({ className }: RecentProjectsProps) {
    const navigate = useNavigate();

    return (
        <section className={cn("w-full", className)}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                    Recent Projects
                </h3>
            </div>

            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                    <FolderKanban className="h-8 w-8" />
                </div>

                <h4 className="mt-6 text-xl font-semibold text-white">
                    No projects yet
                </h4>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    Your recently created projects will appear here. Create your
                    first project to start planning AI-powered sprints and
                    collaborating with your team.
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