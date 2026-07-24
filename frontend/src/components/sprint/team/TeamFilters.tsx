import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type TeamFiltersProps = {
    className?: string;
};

export default function TeamFilters({ className }: TeamFiltersProps) {
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
                    placeholder="Search members"
                    className="w-full border-0 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-400">
                    <span className="whitespace-nowrap">Role</span>
                    <select className="bg-transparent text-sm text-slate-100 outline-none">
                        <option value="">All</option>
                        <option value="product">Product</option>
                        <option value="engineering">Engineering</option>
                        <option value="design">Design</option>
                    </select>
                </label>

                <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-400">
                    <span className="whitespace-nowrap">Status</span>
                    <select className="bg-transparent text-sm text-slate-100 outline-none">
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
