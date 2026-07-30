import type { FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    loading?: boolean;
}

export default function SearchBar({ value, onChange, onSubmit, loading = false }: SearchBarProps) {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[var(--app-text)] shadow-[var(--shadow-sm)]">
                <Search className="h-4 w-4 text-violet-400" />
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Search corpus records, topics, or metadata"
                    className="w-full bg-transparent text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-soft)]"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-[var(--app-surface)] transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    );
}
