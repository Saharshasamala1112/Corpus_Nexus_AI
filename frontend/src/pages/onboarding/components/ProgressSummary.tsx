type ProgressSummaryProps = {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  progress: number
}

type StatItemProps = {
  label: string
  value: number
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
      <p className="text-sm text-zinc-500">{label}</p>

      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}

function ProgressSummary({
  totalTasks,
  completedTasks,
  pendingTasks,
  progress,
}: ProgressSummaryProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
            Progress Summary
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatItem label="Total Tasks" value={totalTasks} />

            <StatItem label="Completed Tasks" value={completedTasks} />

            <StatItem label="Pending Tasks" value={pendingTasks} />
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-400">Progress</span>

            <span className="font-medium text-white">{progress}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-zinc-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressSummary
