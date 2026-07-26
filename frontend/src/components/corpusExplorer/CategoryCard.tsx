import { Layers3 } from "lucide-react";

import type { CategoryItem } from "@/types/corpusExplorer";

interface CategoryCardProps {
    category: CategoryItem;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[var(--app-surface-secondary)]">
            <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-3 text-violet-300">
                    <Layers3 className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-[var(--app-strong)]">{category.name}</h3>
                    {category.count ? <p className="text-sm text-[var(--app-text-muted)]">{category.count} records</p> : null}
                </div>
            </div>
        </div>
    );
}
