import { ArrowRight, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardHeroProps = {
    className?: string;
};

export default function DashboardHero({ className }: DashboardHeroProps) {
    return (
        <section
            className={cn(
                "relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-600/25 via-indigo-500/20 to-cyan-500/20 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10",
                className
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.16),_transparent_28%)]" />
            <div className="absolute -left-12 top-8 h-28 w-28 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-slate-100 backdrop-blur">
                        <Sparkles className="h-4 w-4 text-cyan-300" />
                        <span>SprintWise AI</span>
                    </div>

                    <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Build better sprints with AI
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                        Plan projects, organize teams, and generate high-impact sprint workflows with intelligent guidance built for modern product teams.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button type="button" variant="default" className="w-full sm:w-auto">
                            <Sparkles className="h-4 w-4" />
                            New Project
                        </Button>
                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                            Explore Projects
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur sm:p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Sprint Pulse</p>
                            <p className="mt-1 text-lg font-semibold text-white">Weekly overview</p>
                        </div>
                        <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-300">
                            <Zap className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        {[
                            ["Active Projects", "12"],
                            ["AI Suggestions", "48"],
                            ["Velocity", "87%"],
                            ["Team Capacity", "92%"],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                            >
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className="mt-1 text-base font-semibold text-white">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
