import type { ReactNode } from 'react'

interface Props {
    content: string
}

function renderInline(text: string): ReactNode[] {
    const parts: ReactNode[] = []
    const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(text))) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index))
        }

        if (match[1] && match[2]) {
            parts.push(
                <a key={`${match.index}-link`} href={match[2]} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200 underline decoration-cyan-500/40">
                    {match[1]}
                </a>,
            )
        } else if (match[3]) {
            parts.push(<strong key={`${match.index}-bold`} className="font-semibold text-white">{match[3]}</strong>)
        } else if (match[4]) {
            parts.push(<em key={`${match.index}-italic`} className="italic text-zinc-200">{match[4]}</em>)
        }

        lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex))
    }

    return parts
}

export default function MarkdownContent({ content }: Props) {
    const segments = content.split(/(```[\s\S]*?```)/g)

    return (
        <div className="prose prose-sm max-w-full text-zinc-200">
            {segments.map((segment, index) => {
                if (segment.startsWith('```') && segment.endsWith('```')) {
                    const codeBlock = segment.replace(/```/g, '').trim()
                    const firstLine = codeBlock.split('\n')[0] || ''
                    const lang = firstLine.match(/^\s*([a-zA-Z0-9_+-]+)/)?.[1] || ''
                    const code = lang ? codeBlock.split('\n').slice(1).join('\n') : codeBlock
                    return (
                        <pre key={index} className="mt-2 overflow-x-auto rounded-2xl bg-zinc-950/90 p-4 text-xs text-zinc-100 ring-1 ring-white/10 shadow-lg">
                            <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-400">
                                <div className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-cyan-400/80" />
                                    <span>{lang || 'code'}</span>
                                </div>
                            </div>
                            <code className="whitespace-pre font-mono text-[13px]">{code}</code>
                        </pre>
                    )
                }

                if (!segment.trim()) return null

                return (
                    <p key={index} className="whitespace-pre-wrap leading-7 text-sm text-zinc-200">
                        {renderInline(segment)}
                    </p>
                )
            })}
        </div>
    )
}
