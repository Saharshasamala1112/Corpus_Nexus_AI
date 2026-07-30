import { ArrowUpRight, Download } from "lucide-react";
import { Link } from "react-router-dom";

import type { CorpusRecord } from "@/types/corpusExplorer";

interface RecordCardProps {
    record: CorpusRecord;
}

export default function RecordCard({ record }: RecordCardProps) {
    return (
        <article className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--shadow-md)] transition hover:border-[var(--app-accent)]/40 hover:-translate-y-1">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--app-strong)]">{record.title}</h3>
                    <p className="mt-2 text-sm text-[var(--app-text-muted)]">{record.description}</p>
                </div>
                <Link
                    to={`/corpus-explorer/record/${record.uid ?? record.id}`}
                    className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-2 text-[var(--app-text)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-strong)]"
                >
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--app-text)]">
                <span className="rounded-full border border-[var(--app-accent-soft)] bg-[var(--app-accent-soft)] px-2.5 py-1">{record.language}</span>
                <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-2.5 py-1">{record.category}</span>
            </div>

            {record.downloadLinks?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {record.downloadLinks.map((link) => (
                        <a
                            key={link.url}
                            href={link.url}
                            rel="noreferrer"
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-1.5 text-xs text-[var(--app-text)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-strong)]"
                        >
                            <Download className="h-3.5 w-3.5" />
                            {link.label}
                        </a>
                    ))}
                </div>
            ) : null}
        </article>
    );
}
