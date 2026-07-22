import type { Project } from "../../types/sprint/project";

const API_URL = "https://sprintwise-ai-backend.onrender.com";

function getHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

async function handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Request failed");
    }

    return (text ? (JSON.parse(text) as T) : (null as T));
}

export async function getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects/`, {
        headers: getHeaders(),
    });

    return handleResponse<Project[]>(response);
}

export async function getProject(id: string): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        headers: getHeaders(),
    });

    return handleResponse<Project>(response);
}

export async function saveProject(project: Project): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            name: project.name,
            description: project.description,
            sprint_duration: project.sprintDuration,
            team_size: project.teamSize,
            members: project.members,
        }),
    });

    return handleResponse<Project>(response);
}

export async function updateProject(project: Project): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${project.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
            name: project.name,
            description: project.description,
            sprint_duration: project.sprintDuration,
            team_size: project.teamSize,
            members: project.members,
        }),
    });

    return handleResponse<Project>(response);
}

export async function deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to delete project");
    }
}

export async function generateSprint(projectId: string): Promise<{ sprint: string } | null> {
    const response = await fetch(
        `${API_URL}/projects/${projectId}/generate-sprint`,
        {
            method: "POST",
            headers: getHeaders(),
        }
    );

    return handleResponse<{ sprint: string }>(response);
}
