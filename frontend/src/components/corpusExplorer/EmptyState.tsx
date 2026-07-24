interface EmptyStateProps {
  title: string
  description: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/60 px-6 py-12 text-center shadow-lg shadow-black/20">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  )
}
