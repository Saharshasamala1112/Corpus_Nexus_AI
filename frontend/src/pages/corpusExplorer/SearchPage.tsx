import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import EmptyState from "@/components/corpusExplorer/EmptyState";
import Loader from "@/components/corpusExplorer/Loader";
import ResultCard from "@/components/corpusExplorer/ResultCard";
import SearchBar from "@/components/corpusExplorer/SearchBar";
import { searchCorpusExplorerRecords } from "@/services/corpusExplorerService";
import type { CorpusRecord } from "@/types/corpusExplorer";

export default function SearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [records, setRecords] = useState<CorpusRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadRecords = useCallback(async (nextQuery: string) => {
        setLoading(true);
        setError("");

        try {
            const result = await searchCorpusExplorerRecords(nextQuery);
            setRecords(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to load records");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadRecords("*");
    }, [loadRecords]);

    const filteredRecords = records;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-surface)_0%,var(--app-surface-secondary)_55%,var(--app-bg)_100%)] p-6 shadow-[var(--shadow-md)]">
                <button
                    type="button"
                    onClick={() => navigate("/corpus-explorer")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/20 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
                            <Search className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-[var(--app-strong)]">Search corpus</h1>
                            <p className="text-sm text-[var(--app-text-muted)]">Find records across languages, categories, and metadata.</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="space-y-4">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onSubmit={() => void loadRecords(query || "*")}
                    loading={loading}
                />
            </section>

            {loading ? (
                <Loader />
            ) : error ? (
                <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    {error}
                </div>
            ) : filteredRecords.length === 0 ? (
                <EmptyState
                    title="No records found"
                    description="Try another search phrase or broaden the filters to discover more results."
                />
            ) : (
                <section className="grid gap-4 xl:grid-cols-2">
                    {filteredRecords.map((record) => (
                        <ResultCard key={record.uid ?? record.id} record={record} />
                    ))}
                </section>
            )}
        </div>
    );
}
