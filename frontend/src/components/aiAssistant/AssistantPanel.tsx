import { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, Loader, Paperclip, Mic, Download, Trash2, Pencil, RotateCw } from "lucide-react";
import RobotSvg from '@/assets/robot.svg';
import { askAssistant, getAssistantSuggestions, streamAssistant, createConversationOnServer, createMessageOnServer, fetchConversations } from "@/services/assistantService";
import type { AssistantConversation, AssistantMessage } from "@/types/assistant";
import { useAuth } from "@/hooks/useauth";
import ChatMessageList from "./chat/ChatMessageList";

function createMessage(content: string, role: "user" | "assistant", id: string): AssistantMessage {
    return {
        id,
        role,
        content,
        createdAt: new Date().toISOString(),
        isStreaming: false,
    };
}

export default function AssistantPanel() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [conversations, setConversations] = useState<AssistantConversation[]>(() => {
        try {
            const raw = localStorage.getItem("assistant:conversations");
            if (raw) {
                const parsed = JSON.parse(raw) as AssistantConversation[];
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch {
            // ignore malformed local cache
        }
        return [];
    });
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        getAssistantSuggestions().then(setSuggestions);

        // load persisted conversations
        // try to load from server and merge
        (async () => {
            try {
                const serverConvs = await fetchConversations();
                if (serverConvs && serverConvs.length > 0) {
                    const normalized = serverConvs.map((conv) => ({
                        id: conv.id,
                        title: conv.title || "Conversation",
                        messages: (conv.messages || []).map((message: { id: string; role: string; content: string; createdAt?: string }) => ({
                            ...message,
                            id: message.id,
                            role: message.role as "user" | "assistant",
                            content: message.content,
                            createdAt: message.createdAt || new Date().toISOString(),
                        } as AssistantMessage)),
                        createdAt: conv.createdAt || new Date().toISOString(),
                        updatedAt: conv.updatedAt || new Date().toISOString(),
                    })) as AssistantConversation[];
                    setConversations(normalized);
                }
            } catch {
                // ignore server sync failures
            }
        })();

        // start outbox retry loop
        const interval = setInterval(async () => {
            try {
                const raw = localStorage.getItem('assistant:outbox')
                const out = raw ? JSON.parse(raw) : []
                if (Array.isArray(out) && out.length > 0) {
                    const [next, ...rest] = out
                    // try send
                    try {
                        const res = await createMessageOnServer(next.convId, next.message)
                        if (res) {
                            localStorage.setItem('assistant:outbox', JSON.stringify(rest))
                        }
                    } catch {
                        // ignore outbox retry failures
                    }
                }
            } catch {
                // ignore outbox retry failures
            }
        }, 3000)
        return () => clearInterval(interval)
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem('assistant:conversations', JSON.stringify(conversations))
        } catch {
            // ignore persistence failures
        }
    }, [conversations]);

    const activeConversation = useMemo(
        () => conversations.find((c) => c.id === activeConversationId) ?? null,
        [conversations, activeConversationId],
    );

    const handleSend = async (overrideQuestion?: string) => {
        const trimmed = (overrideQuestion ?? question).trim();
        if (!trimmed) return;

        const regenerate = Boolean(overrideQuestion && activeConversation);
        const existingConversation =
            activeConversation ??
            ({
                id: `conv-${Date.now()}`,
                title: trimmed.slice(0, 40),
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as AssistantConversation);

        const nextConversation: AssistantConversation = {
            ...existingConversation,
            messages: regenerate ? existingConversation.messages : [...existingConversation.messages, createMessage(trimmed, "user", `msg-${Date.now()}-user`)],
            updatedAt: new Date().toISOString(),
        };

        setConversations((prev) => {
            const withoutCurrent = prev.filter((c) => c.id !== nextConversation.id);
            return [nextConversation, ...withoutCurrent];
        });
        // persist conversation and the user message to server (best-effort)
        try {
            await createConversationOnServer({ id: nextConversation.id, title: nextConversation.title });
            const userMsg = nextConversation.messages.find((m) => m.role === 'user');
            if (userMsg) await createMessageOnServer(nextConversation.id, { id: userMsg.id, role: 'user', content: userMsg.content });
        } catch {
            // Best-effort persistence; ignore failures.
        }
        setActiveConversationId(nextConversation.id);
        setQuestion("");
        setLoading(true);
        setStreaming(true);

        const assistantId = `msg-${Date.now()}-assistant`;
        const streamingMessage = createMessage("", "assistant", assistantId);
        streamingMessage.isStreaming = true;

        setConversations((prev) =>
            prev.map((c) =>
                c.id === nextConversation.id
                    ? { ...c, messages: [...c.messages, streamingMessage], updatedAt: new Date().toISOString() }
                    : c,
            ),
        );

        const history = nextConversation.messages.filter((m) => m.id !== assistantId).map((m) => ({ role: m.role, content: m.content }));

        // optimistic enqueue helper will be used when persisting messages fails

        try {
            let accumulated = "";
            try {
                // create abort controller for this stream
                controllerRef.current = new AbortController();
                for await (const chunk of streamAssistant(trimmed, history, nextConversation.id, undefined, controllerRef.current.signal)) {
                    accumulated += String(chunk);
                    setConversations((prev) =>
                        prev.map((c) =>
                            c.id === nextConversation.id
                                ? {
                                    ...c,
                                    messages: c.messages.map((m) => (m.id === assistantId ? { ...m, content: accumulated, isStreaming: true } : m)),
                                    updatedAt: new Date().toISOString(),
                                }
                                : c,
                        ),
                    );
                }
                // finalize
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === nextConversation.id
                            ? { ...c, messages: c.messages.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m)), updatedAt: new Date().toISOString() }
                            : c,
                    ),
                );
                // persist assistant message
                try {
                    await createMessageOnServer(nextConversation.id, { id: assistantId, role: 'assistant', content: accumulated });
                } catch {
                    // Best-effort persistence; ignore failures.
                }
            } catch {
                const reply = await askAssistant(trimmed, history, nextConversation.id, nextConversation.title);
                accumulated = reply.answer;
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === nextConversation.id
                            ? { ...c, messages: c.messages.map((m) => (m.id === assistantId ? { ...m, content: accumulated, isStreaming: false, usedCorpus: reply.usedCorpus, sourceCount: reply.sourceCount, confidence: reply.confidence } : m)), updatedAt: new Date().toISOString() }
                            : c,
                    ),
                );
                try {
                    await createMessageOnServer(nextConversation.id, { id: assistantId, role: 'assistant', content: accumulated });
                } catch {
                    // Best-effort persistence; ignore failures.
                }
            }
        } finally {
            setLoading(false);
            setStreaming(false);
            controllerRef.current = null;
        }
    };

    const handleRegenerate = () => {
        if (!activeConversation) return;
        const lastUserMessage = [...activeConversation.messages].reverse().find((message) => message.role === "user");
        if (!lastUserMessage) return;
        void handleSend(lastUserMessage.content);
    };

    const handleRenameConversation = () => {
        if (!activeConversation) return;
        const nextTitle = window.prompt("Rename conversation", activeConversation.title);
        if (!nextTitle) return;
        setConversations((prev) => prev.map((conversation) => conversation.id === activeConversation.id ? { ...conversation, title: nextTitle.trim() || activeConversation.title } : conversation));
    };

    const handleDeleteConversation = () => {
        if (!activeConversation) return;
        const confirmed = window.confirm("Delete this conversation?");
        if (!confirmed) return;
        setConversations((prev) => prev.filter((conversation) => conversation.id !== activeConversation.id));
        setActiveConversationId(null);
    };

    const handleExportConversation = () => {
        if (!activeConversation) return;
        const blob = new Blob([JSON.stringify(activeConversation, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${activeConversation.title || "conversation"}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleStopStream = () => {
        if (controllerRef.current) {
            controllerRef.current.abort()
            controllerRef.current = null
            setStreaming(false)
            // mark any streaming messages as not streaming
            setConversations((prev) => prev.map((c) => ({ ...c, messages: c.messages.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)) })))
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                aria-expanded={open}
                aria-label={open ? "Close CorpusGuard AI" : "Open CorpusGuard AI"}
                className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-0 shadow-[0_12px_30px_rgba(37,99,235,0.28)] transform-gpu transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
                <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-30 blur-md animate-pulse" aria-hidden />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--app-surface)]/60 ring-[var(--app-border)] overflow-hidden">
                    <img src={RobotSvg} alt="assistant" className="h-10 w-10 object-contain" />
                </span>
            </button>

            <AnimatePresence>
                {open ? (
                    <motion.aside
                        initial={{ x: 420, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 420, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        className="fixed right-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-[min(92vw,480px)] flex-col overflow-hidden rounded-[18px] border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--shadow-lg)]"
                    >
                        <div className="px-6 pt-6">
                            <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-2xl bg-[var(--app-surface-secondary)] p-3 shadow-[var(--shadow-md)]">
                                <img src={RobotSvg} alt="robot" className="h-20 w-20 object-contain" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-semibold text-[var(--app-strong)]">Hi, {user?.username || "there"} <span className="inline-block">👋</span></h3>
                                <p className="mt-1 text-sm text-[var(--app-text-muted)]">I'm your Enterprise AI Assistant — ask me anything about Corpus Nexus.</p>
                            </div>
                            <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-full p-2 text-[var(--app-text-muted)] hover:bg-[var(--app-surface-secondary)]/60">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            {activeConversation ? (
                                <div className="mb-4 rounded-3xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4 text-sm text-[var(--app-text)] shadow-inner">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-[var(--app-strong)]">{activeConversation.title || 'Active conversation'}</div>
                                            <div className="mt-1 text-xs text-[var(--app-text-muted)]">
                                                {activeConversation.messages.length} message{activeConversation.messages.length === 1 ? '' : 's'} · updated {new Date(activeConversation.updatedAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveConversationId(null)
                                                    setQuestion("")
                                                }}
                                                className="inline-flex items-center rounded-full border-[var(--app-border)] bg-[var(--app-surface-secondary)]/70 px-3 py-2 text-xs text-[var(--app-text)] transition hover:border-cyan-500 hover:text-[var(--app-strong)]"
                                            >
                                                New chat
                                            </button>
                                            <button type="button" onClick={handleRegenerate} className="inline-flex items-center rounded-full border-[var(--app-border)] bg-[var(--app-surface-secondary)]/70 p-2 text-[var(--app-text)] transition hover:border-cyan-500 hover:text-[var(--app-strong)]" aria-label="Regenerate response">
                                                <RotateCw className="h-3.5 w-3.5" />
                                            </button>
                                            <button type="button" onClick={handleRenameConversation} className="inline-flex items-center rounded-full border-[var(--app-border)] bg-[var(--app-surface-secondary)]/70 p-2 text-[var(--app-text)] transition hover:border-cyan-500 hover:text-[var(--app-strong)]" aria-label="Rename conversation">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button type="button" onClick={handleExportConversation} className="inline-flex items-center rounded-full border-[var(--app-border)] bg-[var(--app-surface-secondary)]/70 p-2 text-[var(--app-text)] transition hover:border-cyan-500 hover:text-[var(--app-strong)]" aria-label="Export conversation">
                                                <Download className="h-3.5 w-3.5" />
                                            </button>
                                            <button type="button" onClick={handleDeleteConversation} className="inline-flex items-center rounded-full border-[var(--app-border)] bg-[var(--app-surface-secondary)]/70 p-2 text-[var(--app-text)] transition hover:border-red-500 hover:text-[var(--app-strong)]" aria-label="Delete conversation">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            {!activeConversation || activeConversation.messages.length === 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4 text-sm text-[var(--app-text)] shadow-inner">
                                        <div className="mb-3 text-sm text-[var(--app-text-muted)]">QUICK QUESTIONS</div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(suggestions.length ? suggestions.slice(0, 6) : [
                                                'Explain Backend Architecture',
                                                'Explain Authentication',
                                                'Show PostgreSQL Schema',
                                                'Explain Docker Setup',
                                                'How do I Deploy?',
                                                'Show Project Structure',
                                            ]).map((s, idx) => (
                                                <motion.button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setQuestion(s)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center gap-3 rounded-lg border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-3 text-left text-sm text-[var(--app-text)] shadow-[var(--shadow-sm)] transition focus:outline-none"
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setQuestion(s); } }}
                                                    tabIndex={0}
                                                    aria-label={`Quick question: ${s}`}
                                                >
                                                    <div className="h-8 w-8 flex-shrink-0 rounded-md bg-gradient-to-br from-blue-600 to-cyan-500 p-1 text-[var(--app-surface)] flex items-center justify-center">{['🎯', '🔒', '📘', '🐳', '🚀', '📁'][idx]}</div>
                                                    <div className="flex-1 text-xs">{s}</div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <ChatMessageList conversation={activeConversation} />
                                </div>
                            )}
                        </div>

                        <div className="border-t border-[var(--app-border)] p-3">
                            <div className="flex items-center gap-2 rounded-2xl border-[var(--app-border)] bg-[var(--app-surface)] p-2">
                                <textarea
                                    ref={inputRef}
                                    rows={1}
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            void handleSend();
                                        }
                                    }}
                                    placeholder="Ask anything about your project or general AI..."
                                    className="min-h-12 max-h-40 w-full resize-none border-0 bg-transparent px-3 py-2 text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
                                    aria-label="Assistant input"
                                />
                                <div className="flex items-center gap-2">
                                    <input id="assistant-file-input" type="file" className="hidden" onChange={async (e) => {
                                        const f = e.target.files?.[0]
                                        if (!f) return
                                        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001'
                                        const userId = localStorage.getItem('assistant:user') || 'anonymous'
                                        const form = new FormData()
                                        form.append('file', f, f.name)
                                        try {
                                            await fetch(`${API_URL}/assistant/upload`, { method: 'POST', body: form, headers: { 'x-user-id': userId } })
                                            // could integrate file link into conversation; skipping for now
                                        } catch {
                                            // ignore upload failures
                                        }
                                    }} />
                                    <label htmlFor="assistant-file-input" className="rounded-full p-2 text-[var(--app-text-muted)] hover:text-[var(--app-text)] cursor-pointer" aria-label="Attach file">
                                        <Paperclip className="h-4 w-4" />
                                    </label>
                                    <button type="button" onClick={async () => {
                                        // simple media recorder flow
                                        try {
                                            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                                            const recorder = new MediaRecorder(stream)
                                            const blobs: Blob[] = []
                                            recorder.ondataavailable = (ev) => blobs.push(ev.data)
                                            recorder.start()
                                            // record 5s by default then stop
                                            setTimeout(() => recorder.stop(), 5000)
                                            await new Promise((res) => recorder.onstop = res)
                                            const blob = new Blob(blobs, { type: 'audio/webm' })
                                            const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type })
                                            const form = new FormData(); form.append('file', file, file.name)
                                            const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001'
                                            const userId = localStorage.getItem('assistant:user') || 'anonymous'
                                            await fetch(`${API_URL}/assistant/upload`, { method: 'POST', body: form, headers: { 'x-user-id': userId } })
                                        } catch {
                                            // ignore recording failures
                                        }
                                    }} className="rounded-full p-2 text-[var(--app-text-muted)] hover:text-[var(--app-text)]" aria-label="Record voice">
                                        <Mic className="h-4 w-4" />
                                    </button>
                                    {streaming ? (
                                        <button type="button" onClick={handleStopStream} className="rounded-full bg-red-600 p-2 text-[var(--app-surface)]" aria-label="Stop streaming response">
                                            <X className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => void handleSend()} disabled={loading || !question.trim()} className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-2 text-[var(--app-surface)] disabled:opacity-60">
                                            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                ) : null}
            </AnimatePresence>
        </>
    );
}
