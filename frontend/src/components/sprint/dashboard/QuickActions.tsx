import {
    ArrowRight,
    BarChart3,
    FolderPlus,
    Sparkles,
    UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

type QuickActionsProps = {
    className?: string;
};

type ActionCard = {
    title: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
    path?: string;
};

const actions: ActionCard[] = [
    {
        title: "New Project",
        description: "Create and organize a new project.",
        icon: <FolderPlus className="h-5 w-5" />,
        accent: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        path: "/sprintwise-ai/projects",
    },
    {
        title: "Generate Sprint",
        description: "Generate an AI-powered sprint plan.",
        icon: <Sparkles className="h-5 w-5" />,
        accent: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        path: "/sprintwise-ai/generator",
    },
    {
        title: "Invite Team",
        description: "Add team members and collaborators.",
        icon: <UserPlus className="h-5 w-5" />,
        accent: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        path: "/sprintwise-ai/team",
    },
    {
        title: "View Reports",
        description: "Review sprint analytics and insights.",
        icon: <BarChart3 className="h-5 w-5" />,
        accent: "bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        // Reports page isn't implemented yet.
    },
];

export default function QuickActions({ className }: QuickActionsProps) {
    const navigate = useNavigate();

    return (
        <section className={cn("w-full", className)}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-[var(--app-strong)]">
                    Quick Actions
                </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {actions.map((action) => (
                    <button
                        key={action.title}
                        type="button"
                        onClick={() => action.path && navigate(action.path)}
                        disabled={!action.path}
                        className={cn(
                            "group rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-left shadow-[var(--shadow-sm)] transition-all duration-200",
                            action.path
                                ? "cursor-pointer hover:-translate-y-0.5 hover:border-[var(--app-accent)]/20 hover:shadow-[var(--shadow-md)]"
                                : "cursor-not-allowed opacity-60"
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className={cn("rounded-xl p-3", action.accent)}>
                                {action.icon}
                            </div>

                            <ArrowRight className="h-4 w-4 text-[var(--app-text-soft)] transition-colors group-hover:text-[var(--app-text-muted)]" />
                        </div>

                        <div className="mt-5">
                            <h4 className="text-base font-semibold text-[var(--app-strong)]">
                                {action.title}
                            </h4>

                            <p className="mt-2 text-sm leading-6 text-[var(--app-text-muted)]">
                                {action.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}