import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type ProjectFiltersProps = {
    className?: string;
    search: string;
    status: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
};

export default function ProjectFilters({
    className,
    search,
    status,
    onSearchChange,
    onStatusChange,
}: ProjectFiltersProps) {
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
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search projects"
                    className="w-full border-0 bg-transparent text-sm text-[var(--app-strong)] outline-none placeholder:text-[var(--app-text-soft)] dark:text-slate-100 dark:placeholder:text-slate-500"
                />
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-sm text-[var(--app-text-soft)] focus-within:border-[var(--app-accent)] focus-within:ring-1 focus-within:ring-[var(--app-accent-soft)] dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400 dark:focus-within:border-cyan-400/25 dark:focus-within:ring-cyan-500/15">
                    <span>Status</span>

                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="bg-transparent text-sm text-[var(--app-strong)] outline-none dark:text-slate-100"
                    >
                        <option>All</option>
                        <option>Planning</option>
                        <option>Active</option>
                        <option>Completed</option>
                    </select>
                </label>
            </div>
        </section>
    );
}