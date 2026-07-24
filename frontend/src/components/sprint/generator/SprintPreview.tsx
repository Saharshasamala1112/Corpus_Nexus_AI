import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SprintResult } from "@/services/sprintGenerator/types";

type SprintPreviewProps = {
    className?: string;
    sprint: SprintResult | null;
};

export default function SprintPreview({
    className,
    sprint,
}: SprintPreviewProps) {
    if (!sprint) {
        return (
            <section
                className={cn(
                    "rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur",
                    className
                )}
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200">
                    <Sparkles className="h-4 w-4" />
                    Sprint Preview
                </div>

                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                    <div className="rounded-2xl bg-cyan-500/10 p-5 text-cyan-300">
                        <Sparkles className="h-10 w-10" />
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold text-white">
                        No sprint generated yet
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                        Describe your sprint goals above and click
                        <span className="font-medium text-white">
                            {" "}
                            Generate Sprint{" "}
                        </span>
                        to preview an AI-generated sprint summary.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            className={cn(
                "rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur",
                className
            )}
        >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Sprint Preview
            </div>

            <div className="mt-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Sprint Goal
                    </h2>

                    <p className="mt-2 text-slate-300">
                        {sprint.goal}
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-white">
                        User Stories
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                        {sprint.stories.map((story, index) => (
                            <li key={index}>{story}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Timeline
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                        {sprint.timeline.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Risks
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                        {sprint.risks.map((risk, index) => (
                            <li key={index}>{risk}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Acceptance Criteria
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                        {sprint.acceptance.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}