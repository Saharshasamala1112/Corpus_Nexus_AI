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
                "rounded-2xl border border-white/10 bg-slate-950/70 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur",
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
                                        ? "border-cyan-400/25 bg-cyan-500/15 text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                        : "border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
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
