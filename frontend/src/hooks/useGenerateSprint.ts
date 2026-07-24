import { useState } from "react";

import { generateSprint } from "@/services/sprint";

import type { SprintResponse } from "@/services/sprint/types";

export function useGenerateSprint() {
    const [loading, setLoading] = useState(false);
    const [sprint, setSprint] = useState<SprintResponse | null>(null);

    async function generate(projectId: string) {
        try {
            setLoading(true);

            const data = await generateSprint(projectId);

            setSprint(data);

            return data;
        } catch (error) {
            console.error("Failed to generate sprint:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        sprint,
        generate,
    };
}