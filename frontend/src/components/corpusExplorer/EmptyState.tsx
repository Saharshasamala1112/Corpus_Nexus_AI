interface EmptyStateProps {
    title: string;
    description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-12 text-center shadow-[var(--shadow-sm)]">
            <h3 className="text-xl font-semibold text-[var(--app-strong)]">{title}</h3>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">{description}</p>
        </div>
    );
}
