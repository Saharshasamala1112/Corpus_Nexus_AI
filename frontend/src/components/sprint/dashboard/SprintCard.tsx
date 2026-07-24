import type { ReactNode } from 'react'

interface SprintCardProps {
  title: string
  children: ReactNode
  className?: string
}

export default function SprintCard({ title, children, className = '' }: SprintCardProps) {
  return (
    <div
      className={`
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-lg
        ${className}
      `}
    >
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-800">{title}</h2>
      </div>

      <div className="p-6">{children}</div>
    </div>
  )
}
