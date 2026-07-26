import { useCorpusExplorerMetadata } from "@/hooks/useCorpusExplorerMetadata";

interface FilterPanelProps {
    selectedLanguage: string;
    selectedCategory: string;
    onLanguageChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

export default function FilterPanel({
    selectedLanguage,
    selectedCategory,
    onLanguageChange,
    onCategoryChange,
}: FilterPanelProps) {
    const { languages, categories, loading, error } = useCorpusExplorerMetadata();

    const languageOptions = ["All", ...languages.map((language) => language.name)];
    const categoryOptions = ["All", ...categories.map((category) => category.name)];

    return (
        <div className="grid gap-4 rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[var(--shadow-sm)] md:grid-cols-2">
            <label className="space-y-2 text-sm text-[var(--app-text)]">
                <span className="block font-medium text-[var(--app-strong)]">Language</span>
                <select
                    value={selectedLanguage}
                    onChange={(event) => onLanguageChange(event.target.value)}
                    className="w-full rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2.5 text-sm text-[var(--app-text)] outline-none transition focus:border-violet-500"
                >
                    {languageOptions.map((language) => (
                        <option key={language} value={language}>
                            {language}
                        </option>
                    ))}
                </select>
            </label>

            <label className="space-y-2 text-sm text-[var(--app-text)]">
                <span className="block font-medium text-[var(--app-strong)]">Category</span>
                <select
                    value={selectedCategory}
                    onChange={(event) => onCategoryChange(event.target.value)}
                    className="w-full rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2.5 text-sm text-[var(--app-text)] outline-none transition focus:border-violet-500"
                >
                    {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </label>

            {(loading || error) ? (
                <div className="md:col-span-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-sm text-[var(--app-text-muted)]">
                    {loading ? "Loading filter options…" : error}
                </div>
            ) : null}
        </div>
    );
}
