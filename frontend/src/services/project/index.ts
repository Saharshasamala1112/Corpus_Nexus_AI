import { api } from "@/api/client";

import type {
    CreateProjectInput,
    Project,
    UpdateProjectInput,
} from "./types";

export async function getProjects(): Promise<Project[]> {
    return api.get<Project[]>("/projects/");
}

export async function getProject(
    projectId: string,
): Promise<Project> {
    return api.get<Project>(`/projects/${projectId}`);
}

export async function createProject(
    project: CreateProjectInput,
): Promise<Project> {
    return api.post<Project>("/projects/", project);
}

export async function updateProject(
    projectId: string,
    project: UpdateProjectInput,
): Promise<Project> {
    return api.put<Project>(
        `/projects/${projectId}`,
        project,
    );
}

export async function deleteProject(
    projectId: string,
): Promise<void> {
    await api.delete(`/projects/${projectId}`);
}