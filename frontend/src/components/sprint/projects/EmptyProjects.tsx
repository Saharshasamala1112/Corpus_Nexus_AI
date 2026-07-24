import { FolderKanban } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyProjectsProps = {
  className?: string
}

export default function EmptyProjects({ className }: EmptyProjectsProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 px-6 py-12 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:px-10',
        className
      )}
    >
      <div className="rounded-2xl bg-cyan-500/15 p-5 text-cyan-300">
        <FolderKanban className="h-10 w-10" />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">No projects found</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        Create your first project to start planning AI-powered sprints.
      </p>

      <Button type="button" variant="default" className="mt-6">
        Create Project
      </Button>
    </section>
  )
}
