import { Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

type SprintPreviewProps = {
  className?: string
}

export default function SprintPreview({ className }: SprintPreviewProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur',
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200">
        <Sparkles className="h-4 w-4" />
        Sprint Preview
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center text-center">
        <div className="rounded-2xl bg-cyan-500/10 p-5 text-cyan-300">
          <Sparkles className="h-10 w-10" />
        </div>

        <h3 className="mt-6 text-2xl font-semibold text-white">No sprint generated yet</h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
          Describe your sprint goals above and click
          <span className="font-medium text-white"> Generate Sprint </span>
          to preview an AI-generated sprint summary.
        </p>
      </div>
    </section>
  )
}
