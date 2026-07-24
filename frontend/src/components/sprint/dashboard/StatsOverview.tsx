import { Activity, FolderKanban, Sparkles, Users } from 'lucide-react'

import StatsCard from '@/components/sprint/common/StatsCard'

const stats = [
  {
    title: 'Projects',
    value: '0',
    subtitle: 'No active projects',
    trend: '',
    icon: <FolderKanban className="h-5 w-5" />,
    color: 'cyan' as const,
  },
  {
    title: 'Team Members',
    value: '0',
    subtitle: 'Invite your team',
    trend: '',
    icon: <Users className="h-5 w-5" />,
    color: 'violet' as const,
  },
  {
    title: 'Sprint Plans',
    value: '0',
    subtitle: 'Generate your first sprint',
    trend: '',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'emerald' as const,
  },
  {
    title: 'Velocity',
    value: '--',
    subtitle: 'Available after your first sprint',
    trend: '',
    icon: <Activity className="h-5 w-5" />,
    color: 'amber' as const,
  },
]

export default function StatsOverview() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </section>
  )
}
