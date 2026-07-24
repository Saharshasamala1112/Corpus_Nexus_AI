import {
    BarChart3,
    ChevronLeft,
    LayoutGrid,
    MessageSquareText,
    PanelLeftClose,
    Rocket,
    Search,
    Settings,
    ShieldCheck,
    Sparkles,
    UserRound,
} from "lucide-react";

import Logo from "../components/navigation/Logo";
import NavItem from "../components/navigation/NavItem";

interface SidebarProps {
    collapsed: boolean;
    mobileOpen: boolean;
    onToggleCollapse: () => void;
    onCloseMobile: () => void;
}

const mainItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/corpus-insights", label: "Corpus Insights", icon: BarChart3 },
    { to: "/ask-corpus", label: "Ask Corpus", icon: MessageSquareText },

    // ✅ Your team's module
    { to: "/corpus-explorer", label: "Corpus Explorer", icon: Search },

    { to: "/sprintwise-ai", label: "SprintWise AI", icon: Rocket },
    { to: "/onboarding", label: "Onboarding", icon: Sparkles },
    { to: "/corpusguard", label: "CorpusGuard", icon: ShieldCheck },
];

const bottomItems = [
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/profile", label: "Profile", icon: UserRound },
];

function Sidebar({
    collapsed,
    mobileOpen,
    onToggleCollapse,
    onCloseMobile,
}: SidebarProps) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-zinc-800 bg-[#09090b] transition-all duration-200 ${
                collapsed ? "w-[72px]" : "w-[260px]"
            } ${
                mobileOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
            }`}
        >
            <div className="flex h-[72px] items-center justify-between border-b border-zinc-800 px-4">
                <div className="flex min-w-0 items-center">
                    <Logo collapsed={collapsed} />
                </div>

                <button
                    type="button"
                    aria-label="Collapse sidebar"
                    className="hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-2 text-zinc-400 transition hover:border-violet-500 hover:text-white lg:inline-flex"
                    onClick={onToggleCollapse}
                >
                    <ChevronLeft
                        className={`h-4 w-4 transition ${
                            collapsed ? "rotate-180" : "rotate-0"
                        }`}
                    />
                </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-5">
                {mainItems.map((item) => (
                    <NavItem
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        icon={item.icon}
                        collapsed={collapsed}
                    />
                ))}
            </nav>

            <div className="space-y-1 border-t border-zinc-800 px-3 py-5">
                {bottomItems.map((item) => (
                    <NavItem
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        icon={item.icon}
                        collapsed={collapsed}
                    />
                ))}
            </div>

            <button
                type="button"
                className="mx-3 mb-4 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-3 text-left text-sm text-zinc-400 transition hover:border-violet-500 hover:text-white lg:hidden"
                onClick={onCloseMobile}
            >
                <PanelLeftClose className="h-4 w-4" />
                <span>Close menu</span>
            </button>
        </aside>
    );
}

export default Sidebar;