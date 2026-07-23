import SprintAcceptance from './SprintAcceptance'
import SprintGoal from './SprintGoal'
import SprintRisk from './SprintRisk'
import SprintTasks from './SprintTasks'
import SprintTimeline from './SprintTimeline'

export interface SprintData {
  goal: string
  tasks: string[]
  timeline: string[]
  risks: string[]
  acceptanceCriteria: string[]
}

interface SprintDashboardProps {
  sprint: SprintData
}

export default function SprintDashboard({ sprint }: SprintDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Sprint Goal */}
      <SprintGoal goal={sprint.goal} />

      {/* Timeline & Tasks */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <SprintTimeline timeline={sprint.timeline} />
        <SprintTasks tasks={sprint.tasks} />
      </div>

      {/* Risks & Acceptance */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <SprintRisk risks={sprint.risks} />
        <SprintAcceptance acceptanceCriteria={sprint.acceptanceCriteria} />
      </div>
    </div>
  )
}
