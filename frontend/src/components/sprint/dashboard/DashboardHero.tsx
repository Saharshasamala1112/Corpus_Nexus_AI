import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";

type DashboardHeroProps = {
    className?: string;
};

export default function DashboardHero({
    className,
}: DashboardHeroProps) {
    const navigate = useNavigate();

    const { stats, loading } = useDashboard();

    const cards = [
        {
            label: "Projects",
            value: loading ? "..." : String(stats.projects),
        },
        {
            label: "Team Members",
            value: loading ? "..." : String(stats.members),
        },
        {
            label: "Sprint Plans",
            value: loading ? "..." : String(stats.sprint_plans),
        },
        {
            label: "AI Suggestions",
            value: loading ? "..." : String(stats.ai_suggestions),
        },
    ];

    return (
        <section
            className={cn(
                "relative overflow-hidden rounded-[28px] border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-accent-soft)_0%,var(--app-surface-secondary)_55%,var(--app-bg)_100%)] p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10",
                className
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--app-surface-secondary)_0%,_transparent_32%),radial-gradient(circle_at_bottom_right,_var(--app-accent-soft)_0%,_transparent_28%)]" />

            <div className="absolute -left-12 top-8 h-28 w-28 rounded-full bg-[var(--app-accent-soft)] blur-3xl" />

            <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-[var(--app-accent-soft)] blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)]/80 px-3 py-1 text-sm font-medium text-[var(--app-text)] backdrop-blur">
                        <Sparkles className="h-4 w-4 text-[var(--app-accent)]" />

                        <span>SprintWise AI</span>
                    </div>

                    <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--app-strong)] sm:text-4xl lg:text-5xl">
                        Build better sprints with AI
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--app-text-muted)] sm:text-base">
                        Create your first project, invite your team, and generate
                        AI-powered sprint plans. Everything you need to organize
                        modern product development in one place.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            className="w-full sm:w-auto"
                            onClick={() =>
                                navigate("/sprintwise-ai/projects")
                            }
                        >
                            <Sparkles className="h-4 w-4" />
                            New Project
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() =>
                                navigate("/sprintwise-ai/projects")
                            }
                        >
                            Explore Projects
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/90 p-5 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--app-text-muted)]">
                                Workspace Overview
                            </p>

                            <p className="mt-1 text-lg font-semibold text-[var(--app-strong)]">
                                Get Started
                            </p>
                        </div>

                        <div className="rounded-full bg-[var(--app-accent-soft)] p-2 text-[var(--app-accent)]">
                            <Zap className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {cards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4"
                            >
                                <p className="text-xs text-[var(--app-text-muted)]">
                                    {card.label}
                                </p>

                                <p className="mt-1 text-xl font-semibold text-[var(--app-strong)]">
                                    {card.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-xl border border-dashed border-[var(--app-accent-soft)] bg-[var(--app-accent-soft)]/70 p-4">
                        <p className="text-sm font-medium text-[var(--app-accent)]">
                            Your workspace is ready
                        </p>

                        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                            {loading
                                ? "Loading workspace..."
                                : `You have ${stats.projects} project${stats.projects !== 1 ? "s" : ""
                                }, ${stats.members} team member${stats.members !== 1 ? "s" : ""
                                }, and ${stats.sprint_plans} sprint plan${stats.sprint_plans !== 1 ? "s" : ""
                                }.`}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}