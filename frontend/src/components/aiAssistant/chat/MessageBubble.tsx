import type { AssistantMessage } from '@/types/assistant'
import MarkdownContent from './MarkdownContent'
import { Loader } from 'lucide-react'

interface Props {
    message: AssistantMessage
}

export default function MessageBubble({ message }: Props) {
    const isUser = message.role === 'user'
    const showSources = !isUser && (message.usedCorpus || message.sourceCount)

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[78%] min-w-0 overflow-hidden break-words [overflow-wrap:anywhere] transform-gpu transition-shadow duration-200 ${isUser ? 'rounded-[28px] rounded-br-[10px] bg-gradient-to-br from-blue-600 to-cyan-500 text-[var(--app-surface)] shadow-[0_24px_80px_-40px_rgba(37,99,235,0.85)]' : 'rounded-[28px] bg-[var(--app-surface)]/95 border border-[var(--app-border)] text-[var(--app-text)] shadow-[var(--shadow-lg)] backdrop-blur-xl'} p-4`}
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--app-text-muted)]">{isUser ? 'You' : 'CorpusGuard'}</div>
                    {showSources ? (
                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-200">
                            {message.sourceCount ? `${message.sourceCount} source${message.sourceCount === 1 ? '' : 's'}` : 'Knowledge-based'}
                        </span>
                    ) : null}
                </div>
                <div className="mt-3 max-w-full text-sm leading-7">
                    <MarkdownContent content={message.content} />
                </div>
                {!isUser && (message.usedCorpus || typeof message.confidence === 'number' || message.sourceCount) ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[var(--app-text-muted)]">
                        {message.usedCorpus ? <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-cyan-200">Corpus-backed</span> : <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-amber-200">General knowledge</span>}
                        {typeof message.confidence === 'number' ? <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)]/70 px-2 py-1 text-[var(--app-text)]">Confidence {message.confidence.toFixed(2)}</span> : null}
                        {message.sourceCount ? <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)]/70 px-2 py-1 text-[var(--app-text)]">{message.sourceCount} source{message.sourceCount === 1 ? '' : 's'}</span> : null}
                    </div>
                ) : null}
                {message.isStreaming ? (
                    <div className="mt-3 flex items-center gap-2 text-xs text-[var(--app-text-muted)]">
                        <Loader className="h-4 w-4 animate-spin" /> Streaming response...
                    </div>
                ) : null}
            </div>
        </div>
    )
}
