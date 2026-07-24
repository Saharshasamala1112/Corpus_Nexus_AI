import PageHeader from '@/components/sprint/common/PageHeader'
import SprintNavigation from '@/components/sprint/common/SprintNavigation'
import TeamSection from '@/components/sprint/team/TeamSection'

export default function Team() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Team"
        description="Manage your engineering team and sprint collaboration."
        actionLabel="Invite Member"
      />

      <SprintNavigation />

      <TeamSection />
    </div>
  )
}
