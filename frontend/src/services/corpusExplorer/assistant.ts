import { askAssistant as askAssistantRequest } from "./api";
import type { AssistantAnswer, CorpusRecord } from "@/types/corpusExplorer";

export async function askAssistant(record: CorpusRecord, question: string): Promise<AssistantAnswer> {
    return askAssistantRequest(record, question);
}
