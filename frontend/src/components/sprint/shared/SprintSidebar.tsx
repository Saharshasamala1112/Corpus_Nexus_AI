import { NavLink, useLocation } from "react-router-dom";
import {
    Bot,
    FolderKanban,
    LayoutDashboard,
    Settings,
    Sparkles,
    Users,  
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type SprintSidebarItem = {
    title: string;
    href: string;
    icon: LucideIcon;
};

type SprintSidebarProps = {
    items?: SprintSidebarItem[];
    title?: string;
    subtitle?: string;
    className?: string;
};

const defaultItems: SprintSidebarItem[] = [
    { title: "Dashboard", href: "/sprint", icon: LayoutDashboard },
    { title: "Projects", href: "/sprint/projects", icon: FolderKanban },
    { title: "Team", href: "/sprint/team", icon: Users },
    { title: "Sprint Generator", href: "/sprint/generator", icon: Bot },
    { title: "Settings", href: "/sprint/settings", icon: Settings },
];

export function SprintSidebar({
    items = defaultItems,
    title = "SprintWise AI",
    subtitle = "AI sprint workspace",
    className,
}: SprintSidebarProps) {
    const location = useLocation();

    const isRouteActive = (href: string) => {
        if (href === "/sprint") {
            return location.pathname === href;
        }

        return (
            location.pathname === href ||
            location.pathname.startsWith(`${href}/`)
        );
    };

    return (
        <aside
            className={cn(
                "flex h-full w-full flex-col border-r border-white/10 bg-[#07111f]/95 text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur",
                className
            )}
        >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/30 ring-1 ring-cyan-400/20">
                    <Sparkles className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-wide text-white">
                        {title}
                    </p>
                    <p className="truncate text-xs text-slate-400">{subtitle}</p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
                <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = isRouteActive(item.href);

                        return (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "group flex min-w-[140px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all lg:min-w-0",
                                        (isActive || active)
                                            ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                                    )
                                }
                            >
                                {({ isActive }) => {
                                    const currentActive = isActive || active;

                                    return (
                                        <>
                                            <span
                                                className={cn(
                                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent transition-colors",
                                                    currentActive
                                                        ? "bg-cyan-500/20 text-cyan-200"
                                                        : "bg-slate-900/70 text-slate-400 group-hover:border-white/10 group-hover:text-white"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span className="truncate">{item.title}</span>
                                        </>
                                    );
                                }}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </aside>
    );
}

export default SprintSidebar;
