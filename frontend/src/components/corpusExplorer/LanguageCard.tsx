import { Globe2 } from "lucide-react";

import type { LanguageItem } from "@/types/corpusExplorer";

interface LanguageCardProps {
    language: LanguageItem;
}

export default function LanguageCard({ language }: LanguageCardProps) {
    return (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-violet-500/40">
            <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-3 text-violet-300">
                    <Globe2 className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">{language.name}</h3>
                    {language.count ? <p className="text-sm text-zinc-400">{language.count} records</p> : null}
                </div>
            </div>
        </div>
    );
}
