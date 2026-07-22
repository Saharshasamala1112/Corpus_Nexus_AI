import api from "../api/axios";

export interface Language {
  name: string;
  code: string | null;
}

export const getLanguages = async (): Promise<Language[]> => {
  try {
    const response = await api.get<Language[]>("/languages");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch languages:", error);
    return [];
  }
};
