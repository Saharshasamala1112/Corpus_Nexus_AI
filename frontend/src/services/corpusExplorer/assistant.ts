import { askAssistant as askAssistantRequest } from "./api";
import type { AssistantAnswer } from "@/types/corpusExplorer";

export async function askAssistant(): Promise<AssistantAnswer> {
    return askAssistantRequest();
}
