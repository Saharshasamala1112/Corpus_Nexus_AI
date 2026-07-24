import { ListChecks } from 'lucide-react'

import { cn } from '@/lib/utils'

type TaskBreakdownProps = {
  className?: string
}

export default function TaskBreakdown({ className }: TaskBreakdownProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur',
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-200">
        <ListChecks className="h-4 w-4" />
        Task Breakdown
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-violet-500/10 p-5 text-violet-300">
          <ListChecks className="h-10 w-10" />
        </div>

        <h3 className="mt-6 text-2xl font-semibold text-white">No tasks generated yet</h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
          Once a sprint is generated, the AI-created task breakdown, priorities, and work items will
          appear here.
        </p>
      </div>
    </section>
  )
}
