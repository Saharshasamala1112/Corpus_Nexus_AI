import api from "../api/axios";

export interface Language {
  id: string;
  name: string;
}

export const getLanguages = async (): Promise<Language[]> => {
  const response = await api.get<Language[]>("/languages");
  return response.data;
};