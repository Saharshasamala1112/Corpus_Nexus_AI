import { Bell, Menu, Search, Sparkles, Zap } from "lucide-react";
import { useLocation } from "react-router-dom";

interface NavbarProps {
    onOpenMobile: () => void;
    collapsed: boolean;
}

const titleMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/corpus-insights": "Corpus Insights",
    "/ask-corpus": "Ask Corpus",
    "/sprintwise-ai": "SprintWise AI",
    "/onboarding": "Onboarding",
    "/corpusguard": "CorpusGuard",
    "/settings": "Settings",
    "/profile": "Profile",
};

function Navbar({ onOpenMobile, collapsed }: NavbarProps) {
    const location = useLocation();
    const title = titleMap[location.pathname] ?? "Dashboard";

    return (
        <header className={`sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-zinc-800 bg-[#09090b]/95 px-4 backdrop-blur md:px-6 ${collapsed ? "lg:pl-6" : "lg:pl-6"}`}>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/70 text-zinc-300 transition hover:border-violet-500 hover:text-white lg:hidden"
                    onClick={onOpenMobile}
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">Corpus Nexus AI</p>
                    <h1 className="text-lg font-semibold text-white">{title}</h1>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <label className="hidden items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-400 md:flex">
                    <Search className="h-4 w-4" />
                    <input
                        aria-label="Search"
                        placeholder="Search workspace"
                        className="w-36 border-none bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 lg:w-48"
                    />
                </label>

                <button className="hidden items-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20 md:inline-flex">
                    <Sparkles className="h-4 w-4" />
                    Ask Assistant
                </button>

                <button className="hidden items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-violet-500 hover:text-white md:inline-flex">
                    <Zap className="h-4 w-4" />
                    Sync Live
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/70 text-zinc-300 transition hover:border-violet-500 hover:text-white">
                    <Bell className="h-4 w-4" />
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-semibold text-white shadow-lg shadow-violet-950/40">
                    MA
                </div>
            </div>
        </header>
    );
}

export default Navbar;