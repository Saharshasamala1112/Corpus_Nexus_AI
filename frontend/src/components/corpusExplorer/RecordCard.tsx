import { ArrowUpRight, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { CorpusRecord } from '@/types/corpusExplorer'

interface RecordCardProps {
  record: CorpusRecord
}

export default function RecordCard({ record }: RecordCardProps) {
  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20 transition hover:border-violet-500/40 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{record.title}</h3>
          <p className="mt-2 text-sm text-zinc-400">{record.description}</p>
        </div>
        <Link
          to={`/corpus-explorer/record/${record.id}`}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-zinc-300 transition hover:border-violet-500 hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-300">
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1">
          {record.language}
        </span>
        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1">
          {record.category}
        </span>
      </div>

      {record.downloadLinks?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {record.downloadLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              rel="noreferrer"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-500 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  )
}
