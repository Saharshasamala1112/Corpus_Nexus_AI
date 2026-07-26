import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TeamGridProps = {
    className?: string;
};

export default function TeamGrid({ className }: TeamGridProps) {
    const navigate = useNavigate();

    return (
        <section className={cn("w-full", className)}>
            <div className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-10 text-center shadow-[var(--shadow-sm)] dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:bg-violet-500/10 dark:text-violet-300">
                    <Users className="h-8 w-8" />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-[var(--app-strong)] dark:text-white">
                    No team members yet
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--app-text-muted)] dark:text-slate-400">
                    Invite your teammates to collaborate on projects, manage
                    sprint planning together, and track progress across your
                    workspace.
                </p>

                <Button
                    className="mt-6"
                    onClick={() => navigate("/sprintwise-ai/team")}
                >
                    Invite Member
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </section>
    );
}