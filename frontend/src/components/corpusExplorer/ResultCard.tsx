import { ArrowUpRight, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import { getLanguageClass, getMultilingualContent } from "@/lib/multilingual";
import type { CorpusRecord } from "@/types/corpusExplorer";

interface ResultCardProps {
    record: CorpusRecord;
}

export default function ResultCard({ record }: ResultCardProps) {
    return (
        <article className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--shadow-md)] transition duration-200 hover:-translate-y-1 hover:border-[var(--app-accent)]/40">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[var(--app-accent-soft)] bg-[var(--app-accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--app-accent)]">
                            {record.language}
                        </span>
                        <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-2.5 py-1 text-[11px] text-[var(--app-text)]">
                            {record.category}
                        </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[var(--app-strong)]">{record.title}</h3>
                    <p className={`mt-2 line-clamp-3 text-sm text-[var(--app-text-muted)] ${getLanguageClass(record.language)}`}>
                        {getMultilingualContent(record)}
                    </p>
                </div>
                <Link
                    to={`/corpus-explorer/record/${record.uid ?? record.id}`}
                    className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-2 text-[var(--app-text)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-strong)]"
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
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-1.5 text-xs text-[var(--app-text)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-strong)]"
                    >
                        <Download className="h-3.5 w-3.5" />
                        {link.label}
                    </a>
                ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-3 text-sm text-[var(--app-text)]">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--app-accent)]" />
                    <span>Metadata</span>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {Object.entries(record.metadata ?? {}).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-[var(--app-text-soft)]">{key}</p>
                            <p className={`mt-1 text-sm text-[var(--app-text)] ${getLanguageClass(record.language)}`}>{String(value ?? "—")}</p>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}
