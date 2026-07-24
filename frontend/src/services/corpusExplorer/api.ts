import api from "@/api/axios";
import { getLanguages as getLanguageCatalog } from "@/services/languageService";
import { getRecords as getCorpusRecords } from "@/services/recordsService";
import type { AssistantAnswer, CorpusProfile, CorpusRecord, CategoryItem, LanguageItem, CorpusExplorerSummary } from "@/types/corpusExplorer";

type ExplorerBackendRecord = {
    id?: string | number;
    title?: string;
    description?: string;
    language?: string;
    category?: string;
    metadata?: Record<string, string | number | boolean | null>;
    media_type?: string;
    location?: {
        latitude?: number;
        longitude?: number;
    };
};

function normalizeListPayload<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) {
        return payload as T[];
    }

    if (payload && typeof payload === "object") {
        const candidate = payload as { data?: unknown; items?: unknown };
        if (Array.isArray(candidate.data)) {
            return candidate.data as T[];
        }
        if (Array.isArray(candidate.items)) {
            return candidate.items as T[];
        }
    }

    return [];
}

export async function login(phone: string, password: string): Promise<{ access_token: string; username: string; phone: string }> {
    const response = await api.post<{ access_token: string; username: string; phone: string }>('/auth/login', { phone, password });
    return response.data;
}

export function logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
}

export async function getProfile(): Promise<CorpusProfile> {
    const response = await api.get<{ username?: string; name?: string; phone?: string; email?: string; organisation?: string; profession?: string; roles?: string[]; location?: string }>('/auth/me');
    return {
        username: response.data.username ?? "",
        name: response.data.name ?? response.data.username ?? "Corpus User",
        phone: response.data.phone ?? "",
        email: response.data.email ?? "",
        organisation: response.data.organisation ?? "",
        profession: response.data.profession ?? "",
        roles: response.data.roles ?? [],
        location: response.data.location ?? "",
    };
}

export async function searchRecords(query: string): Promise<CorpusRecord[]> {
    const records = await getCorpusRecords(0, 1000);
    const normalizedQuery = query.trim().toLowerCase();

    const explorerRecords: CorpusRecord[] = (records as ExplorerBackendRecord[]).map((record, index) => ({
        id: record.id ?? index + 1,
        title: record.title ?? `Record ${index + 1}`,
        description: record.description ?? "No description available",
        language: record.language ?? "Unknown",
        category: record.category ?? "General",
        metadata: record.metadata ?? {},
        downloadLinks: [],
    }));

    if (!normalizedQuery || normalizedQuery === "*") {
        return explorerRecords;
    }

    return explorerRecords.filter((record) => {
        const haystack = [record.title, record.description, record.language, record.category, JSON.stringify(record.metadata)]
            .join(" ")
            .toLowerCase();

        return haystack.includes(normalizedQuery);
    });
}

export async function getLanguages(): Promise<LanguageItem[]> {
    const languageCatalog = await getLanguageCatalog();
    return languageCatalog.map((language) => ({ id: language.id, name: language.name }));
}

export async function getCategories(): Promise<CategoryItem[]> {
    const response = await api.get<unknown>("/categories");
    return normalizeListPayload<CategoryItem>(response.data);
}

export async function getRecord(id: string): Promise<CorpusRecord> {
    const response = await api.get<CorpusRecord>(`/records/${id}`);
    return response.data;
}

export async function askAssistant(): Promise<AssistantAnswer> {
    const response = await api.get<{ message?: string }>("/auth/me");
    return { answer: response.data.message ?? "Assistant is unavailable for the current backend." };
}

export async function getExplorerDashboardSummary(): Promise<CorpusExplorerSummary> {
    const [records, languages, categories, profile] = await Promise.all([
        getCorpusRecords(0, 1000),
        getLanguages(),
        getCategories(),
        getProfile(),
    ]);

    return {
        totalRecords: records.length,
        totalLanguages: languages.length,
        totalCategories: categories.length,
        profileName: profile.name || profile.username || "Corpus User",
    };
}
