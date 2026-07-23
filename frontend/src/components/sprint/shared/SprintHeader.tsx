import { Bell, Bot, Search, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SprintHeaderProps = {
    title?: string;
    subtitle?: string;
    className?: string;
};

export function SprintHeader({
    title = "Sprint Overview",
    subtitle = "Track progress and move faster",
    className,
}: SprintHeaderProps) {
    return (
        <header
            className={cn(
                "flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#07111f]/95 px-4 py-3 sm:px-6",
                className
            )}
        >
            <div className="min-w-0">
                <h1 className="truncate text-base font-semibold text-white sm:text-lg">
                    {title}
                </h1>
                <p className="truncate text-sm text-slate-400">{subtitle}</p>
            </div>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
                <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-400 sm:max-w-[280px]">
                    <Search className="h-4 w-4 shrink-0 text-slate-500" />
                    <Input
                        type="search"
                        placeholder="Search sprint"
                        className="h-8 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-slate-500 focus:ring-0"
                    />
                </label>

                <Button variant="outline" className="hidden sm:inline-flex">
                    <Bot className="h-4 w-4" />
                    Ask Assistant
                </Button>

                <Button variant="secondary" className="hidden sm:inline-flex">
                    <Sparkles className="h-4 w-4" />
                    Sync Live
                </Button>

                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
                    <Bell className="h-4 w-4" />
                </button>

                <Avatar className="ring-1 ring-white/10">
                    <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" alt="User avatar" />
                    <AvatarFallback>AL</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}

export default SprintHeader;
