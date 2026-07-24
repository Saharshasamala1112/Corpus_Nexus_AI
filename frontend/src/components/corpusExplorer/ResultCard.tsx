import { ArrowUpRight, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import type { CorpusRecord } from "@/types/corpusExplorer";

interface ResultCardProps {
    record: CorpusRecord;
}

export default function ResultCard({ record }: ResultCardProps) {
    return (
        <article className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-300">
                            {record.language}
                        </span>
                        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300">
                            {record.category}
                        </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white">{record.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{record.description}</p>
                </div>
                <Link
                    to={`/corpus-explorer/record/${record.id}`}
                    className="rounded-2xl border border-zinc-700 bg-zinc-900/90 p-2 text-zinc-300 transition hover:border-violet-500 hover:text-white"
                    aria-label={`Open ${record.title}`}
                >
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {record.downloadLinks?.slice(0, 2).map((link) => (
                    <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-500 hover:text-white"
                    >
                        <Download className="h-3.5 w-3.5" />
                        {link.label}
                    </a>
                ))}
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-400" />
                    <span>Metadata</span>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {Object.entries(record.metadata ?? {}).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-zinc-500">{key}</p>
                            <p className="mt-1 text-sm text-zinc-200">{String(value ?? "—")}</p>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}
