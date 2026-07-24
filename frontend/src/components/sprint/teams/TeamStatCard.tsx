import type { ReactNode } from 'react'

interface TeamStatCardProps {
  title: string
  value: number
  icon: ReactNode
  color: string
}

export default function TeamStatCard({ title, value, icon, color }: TeamStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">{value}</h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl text-white ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
