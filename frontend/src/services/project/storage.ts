import type { Project } from "./types";

const STORAGE_KEY = "sprintwise-projects";

export function loadProjects(): Project[] {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return [];
    }

    try {
        return JSON.parse(stored) as Project[];
    } catch {
        return [];
    }
}

export function saveProjects(projects: Project[]): void {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
    );
}