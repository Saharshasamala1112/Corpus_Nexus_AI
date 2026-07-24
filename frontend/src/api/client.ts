const API_BASE_URL =
    import.meta.env.VITE_API_URL ??
    "http://localhost:8000";

async function request<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options?.headers ?? {}),
            },
            ...options,
        },
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "API request failed");
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

export const api = {
    get: <T>(url: string) => request<T>(url),
    post: <T>(url: string, body: unknown) =>
        request<T>(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),
    put: <T>(url: string, body: unknown) =>
        request<T>(url, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: <T>(url: string) =>
        request<T>(url, {
            method: "DELETE",
        }),
};