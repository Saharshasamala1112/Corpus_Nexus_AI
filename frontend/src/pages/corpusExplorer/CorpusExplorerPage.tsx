import { ArrowRight, BriefcaseBusiness, FileSearch, Globe2, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { useCorpusExplorerSummary } from "@/hooks/useCorpusExplorerSummary";

const homeCards = [
    {
        title: "Search Corpus",
        description: "Locate records, metadata, and downloadable assets in one place.",
        to: "/corpus-explorer/search",
        icon: FileSearch,
    },
    {
        title: "Browse Languages",
        description: "Explore language coverage and discover multilingual corpus depth.",
        to: "/corpus-explorer/languages",
        icon: Globe2,
    },
    {
        title: "Browse Categories",
        description: "Jump into curated content categories to narrow discovery.",
        to: "/corpus-explorer/categories",
        icon: BriefcaseBusiness,
    },
    {
        title: "My Profile",
        description: "Review your account details and organisation membership.",
        to: "/corpus-explorer/profile",
        icon: UserRound,
    },
];

export default function CorpusExplorerPage() {
    const { summary, loading, error } = useCorpusExplorerSummary();

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
                    <FileSearch className="h-4 w-4" />
                    Corpus Explorer
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Explore your corpus with speed and control.
                </h1>
                <p className="mt-3 max-w-3xl text-base text-zinc-400">
                    Search records, browse by language or category, and open the AI-powered context layer for any selected document.
                </p>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardContent className="p-5">
                        <p className="text-sm text-zinc-400">Available records</p>
                        <p className="mt-3 text-3xl font-semibold text-white">{loading ? "—" : summary.totalRecords}</p>
                    </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardContent className="p-5">
                        <p className="text-sm text-zinc-400">Languages</p>
                        <p className="mt-3 text-3xl font-semibold text-white">{loading ? "—" : summary.totalLanguages}</p>
                    </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardContent className="p-5">
                        <p className="text-sm text-zinc-400">Categories</p>
                        <p className="mt-3 text-3xl font-semibold text-white">{loading ? "—" : summary.totalCategories}</p>
                    </CardContent>
                 </Card>
                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardContent className="p-5">
                        <p className="text-sm text-zinc-400">Profile</p>
                        <p className="mt-3 text-2xl font-semibold text-white">{loading ? "—" : summary.profileName}</p>
                    </CardContent>
                </Card>
            </section>

            {error ? (
                <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    {error}
                </div>
            ) : null}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {homeCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Card
                            key={card.title}
                            className="group overflow-hidden border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40"
                        >
                            <CardContent className="flex h-full flex-col justify-between p-5">
                                <div>
                                    <div className="inline-flex rounded-2xl border border-violet-500/30 bg-violet-500/10 p-3 text-violet-300">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h2 className="mt-4 text-lg font-semibold text-white">{card.title}</h2>
                                    <p className="mt-2 text-sm text-zinc-400">{card.description}</p>
                                </div>
                                <Link
                                    to={card.to}
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-violet-200"
                                >
                                    Open module
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>
        </div>
    );
}
