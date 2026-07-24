import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  actionLabel?: string
  actionIcon?: ReactNode
  onAction?: () => void
  className?: string
}

export default function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6',
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
        ) : null}
      </div>

      {actionLabel ? (
        <Button type="button" variant="default" onClick={onAction} className="w-full sm:w-auto">
          {actionIcon ? <span className="flex items-center gap-2">{actionIcon}</span> : null}
          <span>{actionLabel}</span>
        </Button>
      ) : null}
    </section>
  )
}
