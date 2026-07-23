import type { AssistantAnswer, CorpusProfile, CorpusRecord, CategoryItem, LanguageItem } from "@/types/corpusExplorer";

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

async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
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
        throw new Error("Unauthorized");
    }

    const text = await response.text();
    const data = text ? (JSON.parse(text) as T) : (null as T);

    if (!response.ok) {
        const message = typeof data === "object" && data && "detail" in data
            ? String((data as { detail?: string }).detail ?? "API Error")
            : "API Error";
        throw new Error(message);
    }

    return data;
}

export async function login(phone: string, password: string): Promise<{ access_token: string; username: string; phone: string }> {
    return requestJson(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ phone, password }),
    });
}

export function logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("phone");
    window.location.href = "/login";
}

export async function getProfile(): Promise<CorpusProfile> {
    return requestJson<CorpusProfile>(`${API_URL}/profile`);
}

export async function searchRecords(query: string): Promise<CorpusRecord[]> {
    return requestJson<CorpusRecord[]>(`${API_URL}/search?q=${encodeURIComponent(query)}`);
}

export async function getLanguages(): Promise<LanguageItem[]> {
    return requestJson<LanguageItem[]>(`${API_URL}/languages`);
}

export async function getCategories(): Promise<CategoryItem[]> {
    return requestJson<CategoryItem[]>(`${API_URL}/categories`);
}

export async function getRecord(id: string): Promise<CorpusRecord> {
    return requestJson<CorpusRecord>(`${API_URL}/records/${id}`);
}

export async function askAssistant(record: CorpusRecord, question: string): Promise<AssistantAnswer> {
    return requestJson<AssistantAnswer>(`${API_URL}/assistant/ask`, {
        method: "POST",
        body: JSON.stringify({ record, question }),
    });
}
