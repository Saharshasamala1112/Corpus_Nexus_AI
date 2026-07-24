export type AssistantRole = "user" | "assistant";

export interface AssistantMessage {
    id: string;
    role: AssistantRole;
    content: string;
    createdAt: string;
    isStreaming?: boolean;
    usedCorpus?: boolean;
    sourceCount?: number;
    confidence?: number;
}

export interface AssistantConversation {
    id: string;
    title: string;
    messages: AssistantMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface AssistantReply {
    answer: string;
    usedCorpus: boolean;
    sourceCount: number;
    confidence?: number;
    conversationId?: string;
}
