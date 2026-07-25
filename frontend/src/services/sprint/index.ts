import type { SprintResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

function getHeaders(): Record<string, string> {
    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export async function generateSprint(
    projectId: string
): Promise<SprintResponse> {
    const response = await fetch(
        `${API_URL}/projects/${projectId}/generate-sprint`,
        {
            method: "POST",
            headers: getHeaders(),
        }
    );

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("phone");

        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to generate sprint");
    }

    return data;
}