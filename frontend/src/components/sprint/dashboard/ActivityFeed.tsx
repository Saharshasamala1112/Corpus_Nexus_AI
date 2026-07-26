import { Activity } from "lucide-react";

import { cn } from "@/lib/utils";

type ActivityFeedProps = {
    className?: string;
};

export default function ActivityFeed({ className }: ActivityFeedProps) {
    return (
        <section className={cn("w-full", className)}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-[var(--app-strong)]">
                    Recent Activity
                </h3>
            </div>

            <div className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-10 text-center shadow-[var(--shadow-sm)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
                    <Activity className="h-8 w-8" />
                </div>

                <h4 className="mt-6 text-xl font-semibold text-[var(--app-strong)]">
                    No activity yet
                </h4>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--app-text-muted)]">
                    Activity will appear here after you create projects,
                    invite team members, or generate AI-powered sprint plans.
                </p>

                <div className="mt-6 inline-flex items-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-4 py-2 text-sm text-[var(--app-text-muted)]">
                    Your workspace is ready to get started.
                </div>
            </div>
        </section>
    );
}