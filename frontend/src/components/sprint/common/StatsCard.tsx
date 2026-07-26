import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatsCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
    trend?: string;
    color?: "cyan" | "violet" | "emerald" | "amber";
    className?: string;
};

const palette = {
    cyan: {
        icon: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        badge: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
    },
    violet: {
        icon: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        badge: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
    },
    emerald: {
        icon: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        badge: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
    },
    amber: {
        icon: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        badge: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
    },
} as const;

export default function StatsCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = "cyan",
    className,
}: StatsCardProps) {
    const styles = palette[color];

    return (
        <article
            className={cn(
                "group rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--app-accent)]/20 hover:shadow-[var(--shadow-md)] sm:p-5",
                className
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm text-[var(--app-text-muted)]">{title}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--app-strong)] sm:text-3xl">
                        {value}
                    </p>
                </div>

                {icon ? (
                    <div className={cn("rounded-lg p-2.5", styles.icon)}>
                        {icon}
                    </div>
                ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                {subtitle ? (
                    <p className="text-sm text-[var(--app-text-soft)]">{subtitle}</p>
                ) : null}

                {trend ? (
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", styles.badge)}>
                        {trend}
                    </span>
                ) : null}
            </div>
        </article>
    );
}
