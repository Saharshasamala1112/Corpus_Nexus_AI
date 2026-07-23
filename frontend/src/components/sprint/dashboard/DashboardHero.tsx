import { ArrowRight, Plus } from "lucide-react";

export default function DashboardHero() {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-700 via-violet-600 to-fuchsia-600 p-8 shadow-xl">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-violet-100">
                        SprintWise AI
                    </p>

                    <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
                        Build better sprints with AI
                    </h1>

                    <p className="mt-4 text-lg leading-8 text-violet-100">
                        Plan projects, organize teams, generate sprint backlogs,
                        and monitor delivery—all from a single workspace inside
                        Corpus Nexus AI.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-violet-700 transition hover:scale-105">
                            <Plus size={18} />
                            New Project
                        </button>

                        <button className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                            Explore Projects
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex h-60 w-full max-w-sm items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
                    <div className="text-center">
                        <p className="text-sm uppercase tracking-widest text-violet-200">
                            AI Workspace
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-white">
                            Sprint Hub
                        </h2>

                        <p className="mt-4 text-violet-100">
                            Projects • Teams • Planning • Insights
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}