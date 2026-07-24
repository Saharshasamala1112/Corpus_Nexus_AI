import SprintCard from './SprintCard'

interface SprintGoalProps {
  goal: string
}

export default function SprintGoal({ goal }: SprintGoalProps) {
  return (
    <SprintCard title="🎯 Sprint Goal">
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white shadow-lg">
        <h3 className="text-xl font-bold">Sprint Objective</h3>

        <p className="mt-4 text-base leading-8 text-blue-50">{goal}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            Sprint Planning
          </span>

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            Team Collaboration
          </span>

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            Agile Workflow
          </span>
        </div>
      </div>
    </SprintCard>
  )
}
