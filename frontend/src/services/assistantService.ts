import api from "@/api/axios";
import { resolveCorpusQuery } from "@/services/corpusQueryEngine";
import type { AssistantReply } from "@/types/assistant";

const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL || "http://localhost:11434";

interface AssistantRequestPayload {
    question: string;
    history?: { role: string; content: string }[];
    context?: string;
    conversation_id?: string;
    conversation_title?: string;
    top_k?: number;
}

interface OllamaResponse {
    response?: string;
    output?: string;
}

async function fallbackToOllama(question: string): Promise<AssistantReply> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.2",
                prompt: `Answer the user question clearly and professionally. Question: ${question}`,
                stream: false,
                max_tokens: 512,
            }),
        });

        if (!response.ok) {
            throw new Error("Ollama request failed");
        }

        const payload = (await response.json()) as OllamaResponse;
        return {
            answer: payload.response ?? payload.output ?? "I could not reach the Ollama fallback model.",
            usedCorpus: false,
            sourceCount: 0,
            confidence: 0.55,
        };
    } catch {
        return {
            answer: "The assistant could not reach the fallback model. Please verify the backend and Ollama configuration.",
            usedCorpus: false,
            sourceCount: 0,
            confidence: 0.0,
        };
    }
}

export async function askAssistant(
    question: string,
    history: { role: string; content: string }[] = [],
    conversationId?: string,
    conversationTitle?: string,
    context?: string,
): Promise<AssistantReply> {
    const corpusResolution = await resolveCorpusQuery(question);

    if (corpusResolution.isCorpusQuestion) {
        if (corpusResolution.answer) {
            return {
                answer: corpusResolution.answer,
                usedCorpus: true,
                sourceCount: corpusResolution.sourceCount,
                confidence: corpusResolution.confidence,
                conversationId,
            };
        }

        const payload: AssistantRequestPayload = {
            question,
            history,
            context: context ?? corpusResolution.context,
            conversation_id: conversationId,
            conversation_title: conversationTitle,
            top_k: 5,
        };

        try {
            const response = await api.post<{ answer?: string; usedCorpus?: boolean; sourceCount?: number; confidence?: number; conversation_id?: string }>('/assistant/chat', payload);
            return {
                answer: response.data.answer ?? "I couldn't produce an answer right now.",
                usedCorpus: true,
                sourceCount: response.data.sourceCount ?? corpusResolution.sourceCount,
                confidence: response.data.confidence ?? corpusResolution.confidence,
                conversationId: response.data.conversation_id,
            };
        } catch {
            return {
                answer: "Unable to retrieve corpus information at the moment.",
                usedCorpus: true,
                sourceCount: 0,
                confidence: 0.0,
                conversationId,
            };
        }
    }

    const payload: AssistantRequestPayload = {
        question,
        history,
        context: context,
        conversation_id: conversationId,
        conversation_title: conversationTitle,
        top_k: 5,
    };

    try {
        const response = await api.post<{ answer?: string; usedCorpus?: boolean; sourceCount?: number; confidence?: number; conversation_id?: string }>('/assistant/chat', payload);
        return {
            answer: response.data.answer ?? "I couldn't produce an answer right now.",
            usedCorpus: response.data.usedCorpus ?? Boolean(payload.context),
            sourceCount: response.data.sourceCount ?? 0,
            confidence: response.data.confidence ?? 0.0,
            conversationId: response.data.conversation_id,
        };
    } catch {
        return await fallbackToOllama(question);
    }
}

export async function* streamAssistant(
    question: string,
    history: { role: string; content: string }[] = [],
    conversationId?: string,
    context?: string,
    signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
    const corpusResolution = await resolveCorpusQuery(question);

    if (corpusResolution.isCorpusQuestion) {
        if (corpusResolution.answer) {
            yield corpusResolution.answer;
            return;
        }

        const payload = {
            question,
            history,
            context: context ?? corpusResolution.context,
            conversation_id: conversationId,
            top_k: 5,
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8001"}/assistant/chat/stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal,
        });

        if (!response.ok) {
            throw new Error(`Stream request failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (!line) continue;
                const payloadLine = line.startsWith("data: ") ? line.slice(6).trim() : line.trim();
                if (!payloadLine) continue;
                if (payloadLine === "[DONE]") return;
                try {
                    const obj = JSON.parse(payloadLine);
                    if (typeof obj === "string") {
                        yield obj;
                    } else if (obj.delta) {
                        yield obj.delta;
                    } else if (obj.content) {
                        yield obj.content;
                    } else if (obj.text) {
                        yield obj.text;
                    } else {
                        yield payloadLine;
                    }
                } catch {
                    yield payloadLine;
                }
            }
        }
    }

    const payload = {
        question,
        history,
        context: context,
        conversation_id: conversationId,
        top_k: 5,
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8001"}/assistant/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal,
    });

    if (!response.ok) {
        throw new Error(`Stream request failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
            if (!line) continue;
            const payloadLine = line.startsWith("data: ") ? line.slice(6).trim() : line.trim();
            if (!payloadLine) continue;
            if (payloadLine === "[DONE]") return;
            try {
                const obj = JSON.parse(payloadLine);
                if (typeof obj === "string") {
                    yield obj;
                } else if (obj.delta) {
                    yield obj.delta;
                } else if (obj.content) {
                    yield obj.content;
                } else if (obj.text) {
                    yield obj.text;
                } else {
                    yield payloadLine;
                }
            } catch {
                yield payloadLine;
            }
        }
    }
}

export async function getAssistantSuggestions(): Promise<string[]> {
    try {
        const response = await api.get<{ suggestions?: string[] }>('/assistant/suggestions');
        if (Array.isArray(response.data?.suggestions)) {
            return response.data.suggestions;
        }
    } catch {
        // ignore and fallback
    }

    return [
        "Summarize the latest corpus health trends",
        "Which records need review today?",
        "Explain the current ingestion pipeline",
        "Show me the most relevant documents for this project",
    ];
}

// Conversation persistence helpers
interface ConversationPayload {
    id: string;
    title?: string;
    messages?: Array<{ id: string; role: string; content: string }>;
    createdAt?: string;
    updatedAt?: string;
}

export async function fetchConversations(): Promise<ConversationPayload[]> {
    try {
        const user = localStorage.getItem('assistant:user') || 'anonymous';
        const response = await api.get<{ conversations?: ConversationPayload[] }>('/assistant/conversations', {
            headers: { 'x-user-id': user },
        });
        return Array.isArray(response.data?.conversations) ? response.data.conversations : [];
    } catch {
        return [];
    }
}

export async function createConversationOnServer(conv: { id: string; title?: string }) {
    try {
        const user = localStorage.getItem('assistant:user') || 'anonymous';
        const response = await api.post('/assistant/conversations', conv, {
            headers: { 'x-user-id': user },
        });
        return response.data;
    } catch {
        return null;
    }
}

export async function createMessageOnServer(convId: string, message: { id?: string; role: string; content: string }) {
    try {
        const user = localStorage.getItem('assistant:user') || 'anonymous';
        const response = await api.post(`/assistant/conversations/${convId}/messages`, message, {
            headers: { 'x-user-id': user },
        });
        return response.data;
    } catch {
        return null;
    }
}
