import { useEffect, useState } from "react";
import { Globe2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import LanguageCard from "@/components/corpusExplorer/LanguageCard";
import Loader from "@/components/corpusExplorer/Loader";
import EmptyState from "@/components/corpusExplorer/EmptyState";
import { getLanguages } from "@/services/corpusExplorer/corpus";
import type { LanguageItem } from "@/types/corpusExplorer";

export default function LanguagesPage() {
    const [languages, setLanguages] = useState<LanguageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function loadLanguages() {
            try {
                const result = await getLanguages();
                setLanguages(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to load languages");
            } finally {
                setLoading(false);
            }
        }

        void loadLanguages();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-3xl border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-surface)_0%,var(--app-surface-secondary)_55%,var(--app-bg)_100%)] p-6 shadow-[var(--shadow-md)]">
                <button
                    type="button"
                    onClick={() => navigate("/corpus-explorer")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/20 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
                        <Globe2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--app-strong)]">Languages</h1>
                        <p className="text-sm text-[var(--app-text-muted)]">Browse all available languages in the corpus network.</p>
                    </div>
                </div>
            </div>

            {languages.length === 0 ? (
                <EmptyState title="No languages available" description="The language catalog is empty right now." />
            ) : (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {languages.map((language) => (
                        <div
                            key={language.id ?? language.name}
                            className="[&>*]:!border-[var(--app-border)] [&>*]:!bg-[var(--app-surface)] [&>*]:!text-[var(--app-text)] [&>*]:!shadow-[var(--shadow-sm)] [&>*]:transition [&>*]:hover:!border-[var(--app-accent)]/40 [&>*]:hover:!-translate-y-1 [&>*]:hover:!bg-[var(--app-surface-secondary)] [&>*]:hover:!shadow-[var(--shadow-md)] [&>div>div>h3]:!text-[var(--app-strong)] [&>div>div>p]:!text-[var(--app-text-muted)]"
                        >
                            <LanguageCard language={language} />
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
