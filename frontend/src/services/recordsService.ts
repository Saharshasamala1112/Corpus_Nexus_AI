import api from "../api/axios";

export interface CorpusRecord {
  uid: string;
  user_id: string;
  username: string | null;
  title: string | null;
  description: string | null;
  media_type: "text" | "audio" | "video" | "image" | "document" | null;
  language: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  status: string | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  reviewed: boolean | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  release_rights: "creator" | "others" | "downloaded" | "NA" | null;
  creator: string | null;
  published_date: string | null;
  source_label: string | null;
  source_url: string | null;
  speech_not_detected: boolean;
  device_uid: string | null;
  category_ids: string[];
  tagged_usernames: string[] | null;
  hashtags: string[] | null;
  record_tags: string[] | null;
  created_at: string;
  updated_at: string;
  duration_seconds: number | null;
  extracted_text: Record<string, unknown> | null;
  extracted_text_source_record_id: string | null;
}

export const getRecords = async (
  skip = 0,
  limit = 1000,
): Promise<CorpusRecord[]> => {
  try {
    const response = await api.get<CorpusRecord[]>(
      `/records?skip=${skip}&limit=${limit}`,
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch records:", error);
    return [];
  }
};

export const getRecordsPaginated = async (
  pages = 3,
): Promise<CorpusRecord[]> => {
  const requests = Array.from({ length: pages }, (_, i) =>
    api.get<CorpusRecord[]>(`/records?skip=${i * 1000}&limit=1000`),
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
