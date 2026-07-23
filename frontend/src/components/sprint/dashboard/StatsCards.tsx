import { FolderKanban, Sparkles, Users, Zap } from "lucide-react";

const stats = [
    {
        title: "Projects",
        value: "12",
        icon: FolderKanban,
    },
    {
        title: "Active Sprints",
        value: "8",
        icon: Zap,
    },
    {
        title: "Team Members",
        value: "42",
        icon: Users,
    },
    {
        title: "AI Suggestions",
        value: "126",
        icon: Sparkles,
    },
];

export default function StatsCards() {
    return (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-zinc-900 p-6 transition hover:border-violet-500/40 hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-400">
                                    {item.title}
                                </p>

                                <h3 className="mt-3 text-3xl font-bold">
                                    {item.value}
                                </h3>
                            </div>

                            <div className="rounded-xl bg-violet-600/20 p-3">
                                <Icon className="text-violet-400" size={24} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}