export type MediaType = "text" | "audio" | "video" | "image" | "document";

export type InsightChartType = "mediaType" | "language" | "leaderboard" | "none";

export interface InsightResponse {
  answer: string;
  chart: InsightChartType;
}

export interface DashboardStats {
  totalRecords: number;
  totalLanguages: number;
}

export interface DailyActivityRow {
  date: string;
  source: string;
  count: number;
}

export interface TopChangedRecord {
  record_id: string;
  title: string;
  total_changes: number;
}

export interface MostActiveUser {
  user_id: string;
  name: string;
  changes_made: number;
}

export interface ChangeActivityReport {
  period_days: number;
  daily_activity: DailyActivityRow[];
  top_changed_records: TopChangedRecord[];
  most_active_users: MostActiveUser[];
}

export interface FieldChangeFrequency {
  field_name: string;
  change_count: number;
  records_affected: number;
}

export interface FieldChangeReport {
  period_days: number;
  field_change_frequency: FieldChangeFrequency[];
}
