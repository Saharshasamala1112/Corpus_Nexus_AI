export default function SprintEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M14 4c0 2.2-1.8 4-4 4S6 6.2 6 4h8Z" />
          <path d="M6 4c0 4.4 3.6 8 8 8" />
          <path d="M10 12c-2 2-3 4.5-3 7 2.5 0 5-1 7-3" />
          <path d="M8 20c1.5-1.5 2.5-3.2 3-5" />
        </svg>
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-800">No Projects Found</h2>

      <p className="mt-3 text-slate-500">Create a project first to generate sprint plans.</p>
    </div>
  )
}
