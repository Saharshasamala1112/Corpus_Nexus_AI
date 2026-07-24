import { loadProjects, saveProjects } from "./storage";

import type { Project } from "./types";

export function getProjects(): Project[] {
    return loadProjects();
}

export function createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
): Project {
    const projects = loadProjects();

    const newProject: Project = {
        ...project,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);

    saveProjects(projects);

    return newProject;
}

export function updateProject(project: Project): void {
    const projects = loadProjects();

    const updated = projects.map((item) =>
        item.id === project.id
            ? {
                ...project,
                updatedAt: new Date().toISOString(),
            }
            : item
    );

    saveProjects(updated);
}

export function deleteProject(projectId: string): void {
    const projects = loadProjects();

    saveProjects(
        projects.filter((project) => project.id !== projectId)
    );
}

export function getProject(
    projectId: string
): Project | undefined {
    return loadProjects().find(
        (project) => project.id === projectId
    );
}