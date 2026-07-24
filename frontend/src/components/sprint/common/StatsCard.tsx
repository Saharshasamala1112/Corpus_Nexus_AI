import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StatsCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: string
  color?: 'cyan' | 'violet' | 'emerald' | 'amber'
  className?: string
}

const palette = {
  cyan: {
    icon: 'bg-cyan-500/15 text-cyan-300',
    badge: 'bg-cyan-500/10 text-cyan-200',
  },
  violet: {
    icon: 'bg-violet-500/15 text-violet-300',
    badge: 'bg-violet-500/10 text-violet-200',
  },
  emerald: {
    icon: 'bg-emerald-500/15 text-emerald-300',
    badge: 'bg-emerald-500/10 text-emerald-200',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-300',
    badge: 'bg-amber-500/10 text-amber-200',
  },
} as const

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'cyan',
  className,
}: StatsCardProps) {
  const styles = palette[color]

  return (
    <article
      className={cn(
        'group rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/10 sm:p-5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
        </div>

        {icon ? <div className={cn('rounded-lg p-2.5', styles.icon)}>{icon}</div> : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}

        {trend ? (
          <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', styles.badge)}>
            {trend}
          </span>
        ) : null}
      </div>
    </article>
  )
}
