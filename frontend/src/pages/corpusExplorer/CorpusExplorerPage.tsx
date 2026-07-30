import { ArrowRight, BriefcaseBusiness, FileSearch, Globe2 } from "lucide-react";
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
];

export default function CorpusExplorerPage() {
    const { summary, loading, error } = useCorpusExplorerSummary();

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-surface)_0%,var(--app-surface-secondary)_55%,var(--app-bg)_100%)] p-6 shadow-[var(--shadow-lg)] sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-accent-soft)] bg-[var(--app-accent-soft)] px-3 py-1 text-sm font-medium text-[var(--app-accent)]">
                    <FileSearch className="h-4 w-4" />
                    Corpus Explorer
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-strong)] sm:text-4xl">
                    Explore your corpus with speed and control.
                </h1>
                <p className="mt-3 max-w-3xl text-base text-[var(--app-text-muted)]">
                    Search records, browse by language or category, and open the AI-powered context layer for any selected document.
                </p>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--shadow-md)]">
                    <CardContent className="p-5">
                        <p className="text-sm text-[var(--app-text-muted)]">Available records</p>
                        <p className="mt-3 text-3xl font-semibold text-[var(--app-strong)]">{loading ? "—" : summary.totalRecords}</p>
                    </CardContent>
                </Card>
                <Card className="border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--shadow-md)]">
                    <CardContent className="p-5">
                        <p className="text-sm text-[var(--app-text-muted)]">Languages</p>
                        <p className="mt-3 text-3xl font-semibold text-[var(--app-strong)]">{loading ? "—" : summary.totalLanguages}</p>
                    </CardContent>
                </Card>
                <Card className="border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--shadow-md)]">
                    <CardContent className="p-5">
                        <p className="text-sm text-[var(--app-text-muted)]">Categories</p>
                        <p className="mt-3 text-3xl font-semibold text-[var(--app-strong)]">{loading ? "—" : summary.totalCategories}</p>
                    </CardContent>
                </Card>
                <Card className="border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--shadow-md)]">
                    <CardContent className="p-5">
                        <p className="text-sm text-[var(--app-text-muted)]">Profile</p>
                        <p className="mt-3 text-2xl font-semibold text-[var(--app-strong)]">{loading ? "—" : summary.profileName}</p>
                    </CardContent>
                </Card>
            </section>

            {error ? (
                <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    {error}
                </div>
            ) : null}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {homeCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Card
                            key={card.title}
                            className="group overflow-hidden border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--shadow-md)] transition duration-200 hover:-translate-y-1 hover:border-[var(--app-accent)]/40"
                        >
                            <CardContent className="flex h-full flex-col justify-between p-5">
                                <div>
                                    <div className="inline-flex rounded-2xl border border-[var(--app-accent-soft)] bg-[var(--app-accent-soft)] p-3 text-[var(--app-accent)]">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h2 className="mt-4 text-lg font-semibold text-[var(--app-strong)]">{card.title}</h2>
                                    <p className="mt-2 text-sm text-[var(--app-text-muted)]">{card.description}</p>
                                </div>
                                <Link
                                    to={card.to}
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--app-accent)] transition hover:text-[var(--app-strong)]"
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
