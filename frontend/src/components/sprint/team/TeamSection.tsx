import TeamFilters from './TeamFilters'
import TeamGrid from './TeamGrid'

import { cn } from '@/lib/utils'

type TeamSectionProps = {
  className?: string
}

export default function TeamSection({ className }: TeamSectionProps) {
  return (
    <section className={cn('flex w-full flex-col gap-6', className)}>
      <TeamFilters />
      <TeamGrid />
    </section>
  )
}
