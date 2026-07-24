import api from "@/lib/api";

import type { SprintResponse } from "./types";

export async function generateSprint(
    projectId: string
): Promise<SprintResponse> {
    const { data } = await api.post<SprintResponse>(
        `/projects/${projectId}/generate-sprint`
    );

    return data;
}