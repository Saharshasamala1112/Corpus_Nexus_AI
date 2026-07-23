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
        accent: "bg-cyan-500/15 text-cyan-300",
        path: "/sprintwise-ai/projects",
    },
    {
        title: "Generate Sprint",
        description: "Generate an AI-powered sprint plan.",
        icon: <Sparkles className="h-5 w-5" />,
        accent: "bg-violet-500/15 text-violet-300",
        path: "/sprintwise-ai/generator",
    },
    {
        title: "Invite Team",
        description: "Add team members and collaborators.",
        icon: <UserPlus className="h-5 w-5" />,
        accent: "bg-emerald-500/15 text-emerald-300",
        path: "/sprintwise-ai/team",
    },
    {
        title: "View Reports",
        description: "Review sprint analytics and insights.",
        icon: <BarChart3 className="h-5 w-5" />,
        accent: "bg-amber-500/15 text-amber-300",
        // Reports page isn't implemented yet.
    },
];

export default function QuickActions({ className }: QuickActionsProps) {
    const navigate = useNavigate();

    return (
        <section className={cn("w-full", className)}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-white">
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
                            "group rounded-xl border border-white/10 bg-slate-950/70 p-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-200",
                            action.path
                                ? "cursor-pointer hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/10"
                                : "cursor-not-allowed opacity-60"
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className={cn("rounded-xl p-3", action.accent)}>
                                {action.icon}
                            </div>

                            <ArrowRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-300" />
                        </div>

                        <div className="mt-5">
                            <h4 className="text-base font-semibold text-white">
                                {action.title}
                            </h4>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {action.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}