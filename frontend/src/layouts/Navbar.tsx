import { LogOut, Menu, Monitor, Moon, Search, Sun, type LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useauth";
import { useTheme, type ThemePreference } from "../context/ThemeContext";
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
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);
    const title = titleMap[location.pathname] ?? "Dashboard";

    const handleSignOut = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const themeOptions: Array<{ value: ThemePreference; label: string; icon: LucideIcon }> = [
        { value: "light", label: "Light", icon: Sun },
        { value: "dark", label: "Dark", icon: Moon },
        { value: "system", label: "System", icon: Monitor },
    ];

    const handleThemeSelect = (nextTheme: ThemePreference) => {
        setTheme(nextTheme);
        setThemeOpen(false);
    };

    const initials = (user?.username || "U")
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className={`sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface)]/80 px-4 backdrop-blur-xl md:px-6 ${collapsed ? "lg:pl-6" : "lg:pl-6"}`}>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)]/80 text-[var(--app-text-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)] lg:hidden"
                    onClick={onOpenMobile}
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--app-accent)]">Corpus Nexus AI</p>
                    <h1 className="text-lg font-semibold tracking-[-0.01em] text-[var(--app-strong)]">{title}</h1>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <label className="hidden items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)]/80 px-3 py-2 text-sm text-[var(--app-text-muted)] shadow-[0_8px_24px_var(--app-accent-soft)] md:flex">
                    <Search className="h-4 w-4" />
                    <input
                        aria-label="Search"
                        placeholder="Search workspace"
                        className="w-36 border-none bg-transparent text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-soft)] focus:border-none lg:w-48"
                    />
                </label>

                <div className="relative">
                    <button
                        type="button"
                        aria-label="Open theme menu"
                        onClick={() => setThemeOpen((current) => !current)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)]/80 text-[var(--app-text-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)]"
                    >
                        {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    </button>

                    {themeOpen ? (
                        <div className="absolute right-0 mt-3 w-40 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/95 p-2 shadow-[0_16px_40px_var(--app-accent-soft)] backdrop-blur-xl">
                            {themeOptions.map((option) => {
                                const Icon = option.icon;
                                const isActive = theme === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleThemeSelect(option.value)}
                                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive
                                            ? "bg-[var(--app-accent-soft)] text-[var(--app-accent)]"
                                            : "text-[var(--app-text-muted)] hover:bg-[var(--app-surface-secondary)] hover:text-[var(--app-text)]"
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                </div>

                <div className="relative">
                    <button
                        type="button"
                        aria-label="Open account menu"
                        onClick={() => setMenuOpen((current) => !current)}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--app-accent)_0%,var(--app-accent-soft)_100%)] font-semibold text-[var(--app-strong)] shadow-[0_10px_28px_var(--app-accent-soft)]"
                    >
                        {initials}
                    </button>

                    {menuOpen ? (
                        <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/95 p-2 shadow-[0_16px_40px_var(--app-accent-soft)] backdrop-blur-xl">
                            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)]/80 px-3 py-3">
                                <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[var(--app-text-muted)]">Account</p>
                                <p className="mt-1 text-sm font-semibold text-[var(--app-text)]">{user?.username || "User"}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--app-text-muted)] transition hover:bg-[var(--app-surface-secondary)] hover:text-[var(--app-text)]"
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