import { useEffect, useState } from "react";

import { getCorpusExplorerCategories, getCorpusExplorerLanguages } from "@/services/corpusExplorerService";
import type { CategoryItem, LanguageItem } from "@/types/corpusExplorer";

export function useCorpusExplorerMetadata() {
    const [languages, setLanguages] = useState<LanguageItem[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadMetadata() {
            setLoading(true);
            setError("");

            try {
                const [languageResult, categoryResult] = await Promise.all([
                    getCorpusExplorerLanguages(),
                    getCorpusExplorerCategories(),
                ]);

                if (isMounted) {
                    setLanguages(languageResult);
                    setCategories(categoryResult);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Unable to load filters");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void loadMetadata();

        return () => {
            isMounted = false;
        };
    }, []);

    return { languages, categories, loading, error };
}
