import { MessageSquareQuote } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface SuggestedQuestionCardProps {
  question: string
  onClick?: (question: string) => void
}

function SuggestedQuestionCard({ question, onClick }: SuggestedQuestionCardProps) {
  return (
    <Card
      className="cursor-pointer border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent-muted"
      onClick={() => onClick?.(question)}
    >
      <div className="flex items-center gap-3">
        <MessageSquareQuote className="size-5 shrink-0 text-primary" />
        <span className="text-sm text-foreground">{question}</span>
      </div>
    </Card>
  )
}

export default SuggestedQuestionCard
