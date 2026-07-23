export default function SprintPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    SprintWise AI
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Plan, manage, and generate AI-powered sprints for your engineering
                    teams.
                </p>
            </div>

            {/* Coming Soon Card */}
            <div className="rounded-2xl border border-white/10 bg-[#1B1633] p-8 shadow-lg">
                <h2 className="text-xl font-semibold text-white">
                    Welcome to SprintWise AI
                </h2>

                <p className="mt-3 text-muted-foreground">
                    This module will help you manage projects, teams, sprint planning,
                    backlog generation, and AI-powered sprint recommendations.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <button className="rounded-lg bg-violet-600 px-5 py-2 font-medium text-white transition hover:bg-violet-500">
                        Create Project
                    </button>

                    <button className="rounded-lg border border-white/10 px-5 py-2 font-medium text-white transition hover:bg-white/5">
                        View Projects
                    </button>
                </div>
            </div>
        </div>
    );
}