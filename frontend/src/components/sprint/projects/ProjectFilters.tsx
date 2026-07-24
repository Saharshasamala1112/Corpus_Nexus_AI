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
                "flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:flex-row sm:items-center sm:justify-between",
                className
            )}
        >
            <label className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-400">
                <Search className="h-4 w-4 shrink-0 text-slate-500" />

                <input
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search projects"
                    className="w-full border-0 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-400">
                    <span>Status</span>

                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="bg-transparent text-sm text-slate-100 outline-none"
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