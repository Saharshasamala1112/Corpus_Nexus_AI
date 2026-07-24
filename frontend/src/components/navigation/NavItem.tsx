import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
    to: string;
    label: string;
    icon: LucideIcon;
    collapsed?: boolean;
}

function NavItem({ to, label, icon: Icon, collapsed = false }: NavItemProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-950/40"
                        : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-100",
                    collapsed && "justify-center px-2"
                )
            }
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-100")} />
                    {!collapsed ? <span>{label}</span> : null}
                </>
            )}
        </NavLink>
    );
}

export default NavItem;
