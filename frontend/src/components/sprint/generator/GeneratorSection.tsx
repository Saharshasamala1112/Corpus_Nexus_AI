import SprintPromptForm from './SprintPromptForm'
import SprintPreview from './SprintPreview'
import TaskBreakdown from './TaskBreakdown'

import { cn } from '@/lib/utils'

type GeneratorSectionProps = {
  className?: string
}

export default function GeneratorSection({ className }: GeneratorSectionProps) {
  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <SprintPromptForm />

      <SprintPreview />

      <TaskBreakdown />
    </section>
  )
}
