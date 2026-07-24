interface SprintSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function SprintSearch({ value, onChange }: SprintSearchProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Search Projects</label>

        <input
          type="text"
          placeholder="Search by project name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
      </div>
    </div>
  )
}
