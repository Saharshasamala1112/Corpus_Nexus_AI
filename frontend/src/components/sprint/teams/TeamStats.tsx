import TeamStatCard from './TeamStatCard'

interface TeamStatsProps {
  totalMembers: number
  totalProjects: number
  totalSkills: number
}

export default function TeamStats({ totalMembers, totalProjects, totalSkills }: TeamStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <TeamStatCard
        title="Team Members"
        value={totalMembers}
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9.5" cy="7" r="3" />
            <path d="M17 8a3 3 0 1 1 0 6" />
            <path d="M17 14v2" />
          </svg>
        }
        color="bg-blue-600"
      />

      <TeamStatCard
        title="Projects"
        value={totalProjects}
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.2a1.5 1.5 0 0 1 1.06.44l1.48 1.48A1.5 1.5 0 0 0 12.3 7H18.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
          </svg>
        }
        color="bg-green-600"
      />

      <TeamStatCard
        title="Skills"
        value={totalSkills}
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="m14.7 6.3 2.9 2.9" />
            <path d="m9 12 2.3 2.3" />
            <path d="M4 20a2 2 0 0 0 2-2l.8-3.3a1 1 0 0 1 .4-.4L12 10l2 2 2.4 2.4a1 1 0 0 1 .4.4L20 18a2 2 0 0 1-2 2H4Z" />
            <path d="m8 4 2 2" />
            <path d="m12 4 2 2" />
            <path d="m16 4 2 2" />
          </svg>
        }
        color="bg-purple-600"
      />
    </div>
  )
}
