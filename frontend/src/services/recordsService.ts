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
  const data = Array.isArray(response.data) ? response.data : [];

  // DEBUG: Log raw response from /records endpoint
  const hindiRecords = data.filter(
    (r: any) => r.language && r.language.toLowerCase().includes("hindi")
  );
  if (hindiRecords.length > 0) {
    console.debug("[RECORDS_SERVICE] Raw /records response - Hindi records found:", {
      count: hindiRecords.length,
      totalRecords: data.length,
      sample: hindiRecords[0],
      allKeys: Object.keys(hindiRecords[0] || {}),
      sampleLanguage: hindiRecords[0]?.language,
      sampleSentence: hindiRecords[0]?.sentence ? `${hindiRecords[0].sentence.substring(0, 100)}...` : null,
      sampleText: hindiRecords[0]?.text ? `${hindiRecords[0].text.substring(0, 100)}...` : null,
      sampleDescription: hindiRecords[0]?.description ? `${hindiRecords[0].description.substring(0, 100)}...` : null,
    });
  }

  return data;
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
