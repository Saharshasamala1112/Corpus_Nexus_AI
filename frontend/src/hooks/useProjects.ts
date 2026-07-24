import { useCallback, useEffect, useState } from "react";

import {
    createProject as createProjectApi,
    deleteProject as deleteProjectApi,
    getProjects,
    updateProject as updateProjectApi,
} from "@/services/project";

import type {
    CreateProjectInput,
    Project,
    UpdateProjectInput,
} from "@/services/project/types";

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshProjects = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getProjects();

            setProjects(data);
        } catch (error) {
            console.error("Failed to load projects:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshProjects();
    }, [refreshProjects]);

    async function createProject(data: CreateProjectInput) {
        await createProjectApi(data);

        await refreshProjects();
    }

    async function updateProject(
        id: string,
        data: UpdateProjectInput
    ) {
        await updateProjectApi(id, data);

        await refreshProjects();
    }

    async function deleteProject(id: string) {
        await deleteProjectApi(id);

        await refreshProjects();
    }

    return {
        loading,
        projects,
        setProjects,
        refreshProjects,
        createProject,
        updateProject,
        deleteProject,
    };
}