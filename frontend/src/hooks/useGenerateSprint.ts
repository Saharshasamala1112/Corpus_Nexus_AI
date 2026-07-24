import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateSprint } from "@/services/sprint";

export function useGenerateSprint(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => generateSprint(projectId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["project", projectId],
            });
        },
    });
}