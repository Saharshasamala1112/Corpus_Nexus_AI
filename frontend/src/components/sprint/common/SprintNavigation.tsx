import { NavLink } from "react-router-dom";
import {
    FolderKanban,
    LayoutDashboard,
    Sparkles,
    Users,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type SprintNavigationProps = {
    className?: string;
};

type NavigationItem = {
    label: string;
    to: string;
    icon: LucideIcon;
};

const items: NavigationItem[] = [
    { label: "Dashboard", to: "/sprintwise-ai", icon: LayoutDashboard },
    { label: "Projects", to: "/sprintwise-ai/projects", icon: FolderKanban },
    { label: "Team", to: "/sprintwise-ai/team", icon: Users },
    { label: "Sprint Generator", to: "/sprintwise-ai/generator", icon: Sparkles },
];

export default function SprintNavigation({ className }: SprintNavigationProps) {
    return (
        <nav
            className={cn(
                "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-2 shadow-[var(--shadow-sm)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                className
            )}
        >
            <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/sprintwise-ai"}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "border-[var(--app-accent)]/25 bg-[var(--app-accent-soft)] text-[var(--app-accent)] shadow-[inset_0_1px_0_rgba(109,40,217,0.15)] dark:border-cyan-400/25 dark:bg-cyan-500/15 dark:text-cyan-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                        : "border-transparent bg-transparent text-[var(--app-text-soft)] hover:border-[var(--app-border)] hover:bg-[var(--app-surface-secondary)] hover:text-[var(--app-strong)] dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white"
                                )
                            }
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
