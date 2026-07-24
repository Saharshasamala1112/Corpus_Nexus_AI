import { useEffect, useState } from "react";
import { Layers3 } from "lucide-react";

import CategoryCard from "@/components/corpusExplorer/CategoryCard";
import EmptyState from "@/components/corpusExplorer/EmptyState";
import Loader from "@/components/corpusExplorer/Loader";
import { getCategories } from "@/services/corpusExplorer/corpus";
import type { CategoryItem } from "@/types/corpusExplorer";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-lg shadow-black/20">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
                        <Layers3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Categories</h1>
                        <p className="text-sm text-zinc-400">Explore corpus segments by top-level category.</p>
                    </div>
                </div>
            </div>

            {categories.length === 0 ? (
                <EmptyState title="No categories available" description="The current category index has no entries to display." />
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
