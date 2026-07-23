import { Link } from 'react-router-dom'

interface TeamMemberCardProps {
  projectId: string
  projectName: string
  name: string
  role: string
  skill: string
  availability: number
}

export default function TeamMemberCard({
  projectId,
  projectName,
  name,
  role,
  skill,
  availability,
}: TeamMemberCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800">{name}</h3>

            <p className="text-slate-500">{role}</p>
          </div>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {skill}
        </span>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-semibold">Availability:</span> {availability} hrs/week
        </p>

        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 text-slate-500"
            aria-hidden="true"
          >
            <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.2a1.5 1.5 0 0 1 1.06.44l1.48 1.48A1.5 1.5 0 0 0 12.3 7H18.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
          </svg>

          <span>{projectName}</span>
        </div>
      </div>

      <Link
        to={`/projects/${projectId}`}
        className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        View Project
      </Link>
    </div>
  )
}
