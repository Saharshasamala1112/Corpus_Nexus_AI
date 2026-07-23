import { Layers3 } from "lucide-react";

import type { CategoryItem } from "@/types/corpusExplorer";

interface CategoryCardProps {
    category: CategoryItem;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-violet-500/40">
            <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-3 text-violet-300">
                    <Layers3 className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">{category.name}</h3>
                    {category.count ? <p className="text-sm text-zinc-400">{category.count} records</p> : null}
                </div>
            </div>
        </div>
    );
}
