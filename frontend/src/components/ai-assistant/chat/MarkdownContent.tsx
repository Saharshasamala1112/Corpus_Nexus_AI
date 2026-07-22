import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string
  className?: string
}

function MarkdownContent({ content, className }: MarkdownContentProps) {
  const html = useMemo(() => renderMarkdown(content), [content])

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-foreground',
        '[&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight',
        '[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium',
        '[&_p]:mb-3 [&_p]:leading-relaxed',
        '[&_ul]:mb-3 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1',
        '[&_ol]:mb-3 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1',
        '[&_li]:text-sm [&_li]:leading-relaxed',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono',
        '[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
        '[&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse',
        '[&_th]:border-b [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-muted-foreground',
        '[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm',
        '[&_strong]:font-semibold [&_strong]:text-foreground',
        '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
        '[&_hr]:my-6 [&_hr]:border-border',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function renderMarkdown(text: string): string {
  let html = escapeHtml(text)

  // Code blocks
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre><code class="language-$1">$2</code></pre>'
  )

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // Tables
  html = html.replace(
    /^\|(.+)\|$/gm,
    (match) => {
      const cells = match
        .split('|')
        .filter((c) => c.trim())
        .map((c) => c.trim())
      if (cells.every((c) => /^[-:]+$/.test(c))) return ''
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`
    }
  )
  html = html.replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
    const rows = match.split('\n').filter((r) => r.trim())
    if (rows.length === 0) return ''
    const headerRow = rows[0]
    const bodyRows = rows.slice(1)
    return `<table><thead>${headerRow}</thead><tbody>${bodyRows.join('')}</tbody></table>`
  })

  // Paragraphs
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<table') ||
        trimmed.startsWith('<hr')
      ) {
        return trimmed
      }
      return `<p>${trimmed}</p>`
    })
    .join('\n')

  // Line breaks within paragraphs
  html = html.replace(/([^>])\n([^<])/g, '$1<br>$2')

  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default MarkdownContent
