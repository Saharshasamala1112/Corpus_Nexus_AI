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
                        ? "bg-[var(--app-accent)] text-[var(--app-strong)] shadow-lg shadow-[color:var(--app-accent-soft)]"
                        : "text-[var(--app-text-muted)] hover:bg-[var(--app-surface-secondary)] hover:text-[var(--app-text)]",
                    collapsed && "justify-center px-2"
                )
            }
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn("h-5 w-5", isActive ? "text-[var(--app-strong)]" : "text-[var(--app-text-muted)] group-hover:text-[var(--app-text)]")} />
                    {!collapsed ? <span>{label}</span> : null}
                </>
            )}
        </NavLink>
    );
}

export default NavItem;
