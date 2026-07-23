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
        'prose prose-sm max-w-none text-blue-100/80',
        '[&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-blue-100',
        '[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-blue-100',
        '[&_p]:mb-3 [&_p]:leading-relaxed',
        '[&_ul]:mb-3 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1',
        '[&_ol]:mb-3 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1',
        '[&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-blue-100/70',
        '[&_code]:rounded [&_code]:bg-blue-500/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:text-cyan-300',
        '[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-blue-500/10 [&_pre]:bg-[#020617]/80 [&_pre]:p-4 [&_pre]:backdrop-blur-xl',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-blue-100/70',
        '[&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse',
        '[&_th]:border-b [&_th]:border-blue-500/10 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-blue-300/60',
        '[&_td]:border-b [&_td]:border-blue-500/10 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:text-blue-100/60',
        '[&_strong]:font-semibold [&_strong]:text-blue-100',
        '[&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-blue-300',
        '[&_hr]:my-6 [&_hr]:border-blue-500/10',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-blue-500/30 [&_blockquote]:pl-4 [&_blockquote]:text-blue-200/50 [&_blockquote]:italic',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

export default memo(MarkdownContent)
