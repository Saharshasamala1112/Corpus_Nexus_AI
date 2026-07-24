import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SprintPromptFormProps = {
    className?: string;
};

export default function SprintPromptForm({ className }: SprintPromptFormProps) {
    return (
        <section
            className={cn(
                "rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur sm:p-6",
                className
            )}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200">
                        <Sparkles className="h-4 w-4" />
                        Sprint AI Prompt
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                        Generate a focused sprint plan in seconds.
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Capture the essentials for your next AI-powered sprint brief and
                        shape a polished execution plan for the team.
                    </p>
                </div>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="project-name" className="text-sm font-medium text-slate-200">
                        Project Name
                    </label>
                    <Input
                        id="project-name"
                        type="text"
                        placeholder="Corpus Nexus AI"
                        className="bg-slate-900/80"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="team-size" className="text-sm font-medium text-slate-200">
                        Team Size
                    </label>
                    <Input
                        id="team-size"
                        type="number"
                        min={1}
                        placeholder="6"
                        className="bg-slate-900/80"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="sprint-goal" className="text-sm font-medium text-slate-200">
                        Sprint Goal
                    </label>
                    <Input
                        id="sprint-goal"
                        type="text"
                        placeholder="Ship a refined onboarding flow and publish the new sprint dashboard"
                        className="bg-slate-900/80"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="sprint-duration" className="text-sm font-medium text-slate-200">
                        Sprint Duration
                    </label>
                    <Input
                        id="sprint-duration"
                        type="text"
                        placeholder="2 weeks"
                        className="bg-slate-900/80"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="additional-context" className="text-sm font-medium text-slate-200">
                        Additional Context
                    </label>
                    <textarea
                        id="additional-context"
                        rows={5}
                        placeholder="Add details about milestones, constraints, stakeholders, dependencies, or release expectations."
                        className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 shadow-sm outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                    />
                </div>

                <div className="flex justify-end md:col-span-2">
                    <Button type="button" variant="default" className="w-full sm:w-auto">
                        <span className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Generate Sprint
                        </span>
                    </Button>
                </div>
            </form>
        </section>
    );
}
