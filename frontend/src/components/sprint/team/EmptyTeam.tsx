import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyTeamProps = {
    className?: string;
};

export default function EmptyTeam({ className }: EmptyTeamProps) {
    return (
        <section
            className={cn(
                "flex flex-col items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-12 text-center shadow-[var(--shadow-sm)] sm:px-10 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                className
            )}
        >
            <div className="rounded-2xl bg-[var(--app-accent-soft)] p-5 text-[var(--app-accent)] dark:bg-cyan-500/15 dark:text-cyan-300">
                <Users className="h-10 w-10" />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-[var(--app-strong)] dark:text-white">
                No team members
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--app-text-muted)] dark:text-slate-400">
                Invite teammates to collaborate on AI-powered sprint planning.
            </p>

            <Button type="button" variant="default" className="mt-6">
                Invite Member
            </Button>
        </section>
    );
}
