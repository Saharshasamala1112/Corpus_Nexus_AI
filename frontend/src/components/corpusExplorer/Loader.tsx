export default function Loader() {
    return (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-text)]">
            <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                <span className="text-[var(--app-text-muted)]">Loading corpus explorer…</span>
            </div>
        </div>
    );
}
