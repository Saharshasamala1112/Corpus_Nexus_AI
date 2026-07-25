import type { DashboardStats } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

function getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export async function getDashboard(): Promise<DashboardStats> {
    const response = await fetch(`${API_URL}/dashboard`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics");
    }

    return response.json();
}