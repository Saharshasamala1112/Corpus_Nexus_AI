export default function Loader() {
    return (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 text-sm text-zinc-300">
            <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                <span>Loading corpus explorer…</span>
            </div>
        </div>
    );
}
