import api from "../api/axios";

export interface DashboardStats {
  totalRecords: number;
  totalLanguages: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [recordsRes, languagesRes] = await Promise.all([
    api.get("/records?skip=0&limit=1000"),
    api.get("/languages"),
  ]);

  const records = Array.isArray(recordsRes.data)
    ? recordsRes.data
    : [];

  const languages = Array.isArray(languagesRes.data)
    ? languagesRes.data
    : [];

  return {
    totalRecords: records.length,
    totalLanguages: languages.length,
  };
};
