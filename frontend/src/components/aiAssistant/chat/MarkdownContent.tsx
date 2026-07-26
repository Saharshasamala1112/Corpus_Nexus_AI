import React, { Fragment, type ReactNode } from 'react'

interface Props {
    content: string
}

const INTERNAL_NOTE_PATTERNS = [
    /general knowledge:/i,
    /streaming response\.\.\./i,
    /since no direct evidence/i,
    /no directly retrieved document evidence/i,
]

function sanitizeContent(content: string): string {
    return content
        .split(/\r?\n/)
        .filter((line) => {
            const trimmed = line.trim()
            if (!trimmed) return true
            return !INTERNAL_NOTE_PATTERNS.some((pattern) => pattern.test(trimmed))
        })
        .join('\n')
}

function renderInline(text: string): ReactNode[] {
    const parts: ReactNode[] = []
    const regex = /(`[^`]+`)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_/g
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(text))) {
        if (match.index > lastIndex) {
            parts.push(<span key={`${match.index}-text`}>{text.slice(lastIndex, match.index)}</span>)
        }

        if (match[1]) {
            parts.push(
                <code key={`${match.index}-code`} className="rounded bg-white/10 px-1 py-0.5 font-mono text-cyan-200">
                    {match[1].slice(1, -1)}
                </code>,
            )
        } else if (match[2] && match[3]) {
            parts.push(
                <a key={`${match.index}-link`} href={match[3]} target="_blank" rel="noreferrer" className="text-cyan-300 underline decoration-cyan-500/40 hover:text-cyan-200">
                    {match[2]}
                </a>,
            )
        } else if (match[4]) {
            parts.push(<strong key={`${match.index}-bold`} className="font-semibold text-white">{match[4]}</strong>)
        } else if (match[5]) {
            parts.push(<strong key={`${match.index}-bold`} className="font-semibold text-white">{match[5]}</strong>)
        } else if (match[6]) {
            parts.push(<em key={`${match.index}-italic`} className="italic text-zinc-200">{match[6]}</em>)
        } else if (match[7]) {
            parts.push(<em key={`${match.index}-italic`} className="italic text-zinc-200">{match[7]}</em>)
        }

        lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
        parts.push(<span key="tail">{text.slice(lastIndex)}</span>)
    }

    return parts
}

function renderParagraph(lines: string[]): ReactNode {
    const content = lines.map((line, index) => (
        <Fragment key={index}>
            {index > 0 ? <br /> : null}
            {renderInline(line)}
        </Fragment>
    ))

    return <p className="mb-3 whitespace-pre-wrap break-words leading-7 text-sm text-zinc-200 [overflow-wrap:anywhere]">{content}</p>
}

function renderList(items: string[], ordered: boolean): ReactNode {
    const Tag = ordered ? 'ol' : 'ul'
    return (
        <Tag className={`mb-3 ml-5 space-y-2 ${ordered ? 'list-decimal' : 'list-disc'} whitespace-pre-wrap break-words leading-7 text-sm text-zinc-200 [overflow-wrap:anywhere]`}>
            {items.map((item, index) => (
                <li key={`${item}-${index}`} className="pl-1">
                    {renderInline(item)}
                </li>
            ))}
        </Tag>
    )
}

async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text)
    } catch {
        // ignore
    }
}

export default function MarkdownContent({ content }: Props) {
    const cleaned = sanitizeContent(content)
    const lines = cleaned.split(/\r?\n/)
    const blocks: ReactNode[] = []
    let index = 0

    while (index < lines.length) {
        const line = lines[index]
        const trimmedLine = line.trim()

        if (!trimmedLine) {
            index += 1
            continue
        }

        if (trimmedLine.startsWith('```')) {
            const fence = trimmedLine.match(/^```(.*)$/)?.[1]?.trim() || ''
            const codeLines: string[] = []
            index += 1
            while (index < lines.length && !lines[index].trim().startsWith('```')) {
                codeLines.push(lines[index])
                index += 1
            }
            if (index < lines.length) {
                index += 1
            }
            const code = codeLines.join('\n')
            blocks.push(
                <pre key={`code-${blocks.length}`} className="mt-2 overflow-x-auto rounded-2xl bg-zinc-950/90 p-4 text-xs text-zinc-100 ring-1 ring-white/10 shadow-lg">
                    <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-400">
                        <div className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-400/80" />
                            <span>{fence || 'code'}</span>
                        </div>
                        <button type="button" onClick={() => void copyToClipboard(code)} className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-zinc-300 hover:text-white">
                            Copy
                        </button>
                    </div>
                    <code className="whitespace-pre-wrap font-mono text-[13px]">{code}</code>
                </pre>,
            )
            continue
        }

        if (/^#{1,6}\s+/.test(trimmedLine)) {
            const match = trimmedLine.match(/^(#{1,6})\s+(.*)$/)
            const level = match?.[1].length ?? 1
            const headingText = match?.[2] ?? line
            const HeadingTag = `h${Math.min(level, 6)}` as keyof React.JSX.IntrinsicElements
            blocks.push(
                React.createElement(HeadingTag, { key: `heading-${blocks.length}`, className: 'mb-3 font-semibold text-white' }, renderInline(headingText))
            )
            index += 1
            continue
        }

        const listMatch = trimmedLine.match(/^(?:[-*+]\s+|\d+\.\s+)(.+)$/)
        if (listMatch) {
            const items: string[] = []
            while (index < lines.length) {
                const currentLine = lines[index].trim()
                const currentMatch = currentLine.match(/^(?:[-*+]\s+|\d+\.\s+)(.+)$/)
                if (!currentMatch) break
                items.push(currentMatch[1])
                index += 1
            }
            blocks.push(renderList(items, /^\d+\.\s+/.test(line)))
            continue
        }

        const paragraphLines: string[] = []
        while (index < lines.length) {
            const currentLine = lines[index]
            const trimmedCurrentLine = currentLine.trim()
            if (!trimmedCurrentLine) break
            if (/^#{1,6}\s+/.test(trimmedCurrentLine) || /^(?:[-*+]\s+|\d+\.\s+)(.+)$/.test(trimmedCurrentLine) || trimmedCurrentLine.startsWith('```')) {
                break
            }
            paragraphLines.push(currentLine)
            index += 1
        }
        if (paragraphLines.length > 0) {
            blocks.push(renderParagraph(paragraphLines))
        }
    }

    return (
        <div className="prose prose-sm max-w-full overflow-hidden break-words text-zinc-200 [overflow-wrap:anywhere]">
            {blocks}
        </div>
    )
}
