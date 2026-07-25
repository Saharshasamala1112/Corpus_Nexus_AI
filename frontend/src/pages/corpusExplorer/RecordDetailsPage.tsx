import { Download, FileText, Globe2, Layers3, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AIAssistant from "@/components/corpusExplorer/AIAssistant";
import Loader from "@/components/corpusExplorer/Loader";
import { getLanguageClass, getMultilingualContent } from "@/lib/multilingual";
import { getRecord } from "@/services/corpusExplorer/corpus";
import type { CorpusRecord } from "@/types/corpusExplorer";

export default function RecordDetailsPage() {
    const { uid } = useParams<{ uid: string }>();
    const [record, setRecord] = useState<CorpusRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadRecord() {
            if (!uid) {
                setError("Missing record identifier");
                setLoading(false);
                return;
            }

            try {
                const result = await getRecord(uid);
                setRecord(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to load record");
            } finally {
                setLoading(false);
            }
        }

        void loadRecord();
    }, [uid]);

    if (loading) {
        return <Loader />;
    }

    if (error || !record) {
        return (
            <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error || "Record not found"}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-300">
                        {record.language}
                    </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300">
                        {record.category}
                    </span>
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white">{record.title}</h1>
                <p className={`mt-3 max-w-3xl text-base text-zinc-400 ${getLanguageClass(record.language)}`}>
                    {getMultilingualContent(record)}
                </p>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20">
                    <h2 className="text-lg font-semibold text-white">Details</h2>
                    <div className="mt-4 space-y-3 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
                            <Globe2 className="h-4 w-4 text-violet-400" />
                            <span>Language: {record.language}</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
                            <Layers3 className="h-4 w-4 text-violet-400" />
                            <span>Category: {record.category}</span>
                        </div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
                            <div className="flex items-center gap-2 text-violet-300">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">Metadata</span>
                            </div>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {Object.entries(record.metadata ?? {}).map(([key, value]) => (
                                    <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">
                                        <p className="text-[11px] uppercase tracking-wide text-zinc-500">{key}</p>
                                        <p className={`mt-1 text-sm text-zinc-200 ${getLanguageClass(record.language)}`}>{String(value ?? "—")}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>

                <article className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20">
                    <div className="flex items-center gap-2 text-violet-300">
                        <Download className="h-4 w-4" />
                        <h2 className="text-lg font-semibold text-white">Download links</h2>
                    </div>
                    <div className="mt-4 space-y-3">
                        {record.downloadLinks?.length ? (
                            record.downloadLinks.map((link) => (
                                <a
                                    key={link.url}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-200 transition hover:border-violet-500 hover:text-white"
                                >
                                    <span>{link.label}</span>
                                    <Download className="h-4 w-4 text-violet-300" />
                                </a>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">
                                No downloadable assets available.
                            </div>
                        )}
                    </div>
                </article>
            </section>

            <AIAssistant />

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Record ready for exploration and retrieval review.
                </div>
            </div>
        </div>
    );
}
