import api from "../api/axios";

export interface CorpusRecord {
  language?: string;
  media_type?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

export const getRecords = async (
  skip = 0,
  limit = 1000,
): Promise<CorpusRecord[]> => {
  const response = await api.get(`/records?skip=${skip}&limit=${limit}`);

  return Array.isArray(response.data) ? response.data : [];
};

export const getRecordsPaginated = async (
  pages = 3,
): Promise<CorpusRecord[]> => {
  const requests = Array.from({ length: pages }, (_, i) =>
    api.get(`/records?skip=${i * 1000}&limit=1000`),
  );

  const responses = await Promise.all(requests);
  const all: CorpusRecord[] = [];

  for (const res of responses) {
    const batch = Array.isArray(res.data) ? res.data : [];
    if (batch.length === 0) break;
    all.push(...batch);
  }

  return all;
};
