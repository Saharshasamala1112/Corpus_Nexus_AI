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

async function apiFetch(
    url: string,
    options: RequestInit = {}
): Promise<any> {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getHeaders(),
            ...(options.headers || {}),
        },
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("phone");

        window.location.href = "/login";
        return;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "API Error");
    }

    return data;
}

/* ---------------- Authentication ---------------- */

export async function getProfile() {
    return apiFetch(`${API_URL}/profile`);
}

/* ---------------- Search ---------------- */

export async function searchRecords(query: string) {
    return apiFetch(
        `${API_URL}/search?q=${encodeURIComponent(query)}`
    );
}

/* ---------------- Languages ---------------- */

export async function getLanguages() {
    return apiFetch(`${API_URL}/languages`);
}

/* ---------------- Categories ---------------- */

export async function getCategories() {
    return apiFetch(`${API_URL}/categories`);
}

/* ---------------- Records ---------------- */

export async function getRecords() {
    return apiFetch(`${API_URL}/records`);
}

export async function getRecord(id: string | number) {
    return apiFetch(`${API_URL}/records/${id}`);
}

/* ---------------- AI Assistant ---------------- */

export async function askAssistant(
    record: any,
    question: string
) {
    return apiFetch(`${API_URL}/assistant/ask`, {
        method: "POST",
        body: JSON.stringify({
            record,
            question,
        }),
    });
}