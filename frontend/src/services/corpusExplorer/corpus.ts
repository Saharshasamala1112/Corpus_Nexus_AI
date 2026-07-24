import { getCategories as getCategoriesRequest, getExplorerDashboardSummary as getExplorerDashboardSummaryRequest, getLanguages as getLanguagesRequest, getRecord as getRecordRequest, searchRecords as searchRecordsRequest } from "./api";
import type { CategoryItem, CorpusExplorerSummary, CorpusRecord, LanguageItem } from "@/types/corpusExplorer";

export async function searchRecords(query: string): Promise<CorpusRecord[]> {
    return searchRecordsRequest(query);
}

export async function getLanguages(): Promise<LanguageItem[]> {
    return getLanguagesRequest();
}

export async function getCategories(): Promise<CategoryItem[]> {
    return getCategoriesRequest();
}

export async function getRecord(id: string): Promise<CorpusRecord> {
    return getRecordRequest(id);
}

export async function getExplorerDashboardSummary(): Promise<CorpusExplorerSummary> {
    return getExplorerDashboardSummaryRequest();
}
