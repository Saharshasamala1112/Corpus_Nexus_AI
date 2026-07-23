import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string
  className?: string
}

function MarkdownContent({ content, className }: MarkdownContentProps) {
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
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

export default memo(MarkdownContent)
