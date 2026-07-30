import { useEffect, useState } from "react";
import { Layers3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CategoryCard from "@/components/corpusExplorer/CategoryCard";
import EmptyState from "@/components/corpusExplorer/EmptyState";
import Loader from "@/components/corpusExplorer/Loader";
import { getCategories } from "@/services/corpusExplorer/corpus";
import type { CategoryItem } from "@/types/corpusExplorer";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function loadCategories() {
            try {
                const result = await getCategories();
                setCategories(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to load categories");
            } finally {
                setLoading(false);
            }
        }

        void loadCategories();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-3xl border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-surface)_0%,var(--app-surface-secondary)_55%,var(--app-bg)_100%)] p-6 shadow-[var(--shadow-md)]">
                <button
                    type="button"
                    onClick={() => navigate("/corpus-explorer")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/20 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
                        <Layers3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--app-strong)]">Categories</h1>
                        <p className="text-sm text-[var(--app-text-muted)]">Explore corpus segments by top-level category.</p>
                    </div>
                </div>
            </div>

            {categories.length === 0 ? (
                <EmptyState
                    title="No categories available"
                    description="The current category index has no entries to display."
                />
            ) : (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {categories.map((category) => (
                        <CategoryCard key={category.id ?? category.name} category={category} />
                    ))}
                </section>
            )}
        </div>
    );
}
