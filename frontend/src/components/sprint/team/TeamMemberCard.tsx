import { ClipboardCheck, ListTodo } from 'lucide-react'

import { cn } from '@/lib/utils'

type TeamMemberCardProps = {
  name: string
  role: string
  avatar: string
  tasksAssigned: number
  completedTasks: number
  status: 'Online' | 'Away' | 'Offline'
  className?: string
}

const statusStyles: Record<TeamMemberCardProps['status'], string> = {
  Online: 'bg-emerald-500/10 text-emerald-200',
  Away: 'bg-amber-500/10 text-amber-200',
  Offline: 'bg-slate-500/10 text-slate-200',
}

export default function TeamMemberCard({
  name,
  role,
  avatar,
  tasksAssigned,
  completedTasks,
  status,
  className,
}: TeamMemberCardProps) {
  return (
    <article
      className={cn(
        'group rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/10',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white">{name}</h3>
              <p className="mt-1 truncate text-sm text-slate-400">{role}</p>
            </div>
            <span
              className={cn('rounded-full px-2.5 py-1 text-xs font-medium', statusStyles[status])}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm text-slate-400">
        <div className="flex items-center gap-1.5">
          <ClipboardCheck className="h-4 w-4" />
          <span>{completedTasks} done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ListTodo className="h-4 w-4" />
          <span>{tasksAssigned} assigned</span>
        </div>
      </div>
    </article>
  )
}
