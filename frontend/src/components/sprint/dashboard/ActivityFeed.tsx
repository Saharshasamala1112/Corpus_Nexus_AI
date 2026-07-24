import { Activity } from 'lucide-react'

import { cn } from '@/lib/utils'

type ActivityFeedProps = {
  className?: string
}

export default function ActivityFeed({ className }: ActivityFeedProps) {
  return (
    <section className={cn('w-full', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-white">Recent Activity</h3>
      </div>

      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
          <Activity className="h-8 w-8" />
        </div>

        <h4 className="mt-6 text-xl font-semibold text-white">No activity yet</h4>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
          Activity will appear here after you create projects, invite team members, or generate
          AI-powered sprint plans.
        </p>

        <div className="mt-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
          Your workspace is ready to get started.
        </div>
      </div>
    </section>
  )
}
