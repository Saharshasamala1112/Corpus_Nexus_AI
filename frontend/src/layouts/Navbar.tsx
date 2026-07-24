import { LogOut, Menu, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useauth";
import { useState } from "react";

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
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const title = titleMap[location.pathname] ?? "Dashboard";

    const handleSignOut = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const initials = (user?.username || "U")
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

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

                <div className="relative">
                    <button
                        type="button"
                        aria-label="Open account menu"
                        onClick={() => setMenuOpen((current) => !current)}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-semibold text-white shadow-lg shadow-violet-950/40"
                    >
                        {initials}
                    </button>

                    {menuOpen ? (
                        <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl shadow-black/30">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-3">
                                <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">Account</p>
                                <p className="mt-1 text-sm font-semibold text-white">{user?.username || "User"}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}

export default Navbar;