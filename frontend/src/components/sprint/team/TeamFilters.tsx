import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type TeamFiltersProps = {
    className?: string;
};

export default function TeamFilters({ className }: TeamFiltersProps) {
    return (
        <section
            className={cn(
                "flex flex-col gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                className
            )}
        >
            <label className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-sm text-[var(--app-text-soft)] focus-within:border-[var(--app-accent)] focus-within:ring-1 focus-within:ring-[var(--app-accent-soft)] dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400 dark:focus-within:border-cyan-400/25 dark:focus-within:ring-cyan-500/15">
                <Search className="h-4 w-4 shrink-0 text-[var(--app-text-muted)] dark:text-slate-500" />
                <input
                    type="search"
                    placeholder="Search members"
                    className="w-full border-0 bg-transparent text-sm text-[var(--app-strong)] outline-none placeholder:text-[var(--app-text-soft)] dark:text-slate-100 dark:placeholder:text-slate-500"
                />
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-sm text-[var(--app-text-soft)] focus-within:border-[var(--app-accent)] focus-within:ring-1 focus-within:ring-[var(--app-accent-soft)] dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400 dark:focus-within:border-cyan-400/25 dark:focus-within:ring-cyan-500/15">
                    <span className="whitespace-nowrap">Role</span>
                    <select className="bg-transparent text-sm text-[var(--app-strong)] outline-none dark:text-slate-100">
                        <option value="">All</option>
                        <option value="product">Product</option>
                        <option value="engineering">Engineering</option>
                        <option value="design">Design</option>
                    </select>
                </label>

                <label className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-sm text-[var(--app-text-soft)] focus-within:border-[var(--app-accent)] focus-within:ring-1 focus-within:ring-[var(--app-accent-soft)] dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400 dark:focus-within:border-cyan-400/25 dark:focus-within:ring-cyan-500/15">
                    <span className="whitespace-nowrap">Status</span>
                    <select className="bg-transparent text-sm text-[var(--app-strong)] outline-none dark:text-slate-100">
                        <option value="">All</option>
                        <option value="online">Online</option>
                        <option value="away">Away</option>
                        <option value="offline">Offline</option>
                    </select>
                </label>
            </div>
        </section>
    );
}
