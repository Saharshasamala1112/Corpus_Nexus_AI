import { ArrowLeft, Bot, Sparkles, Zap, Code, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SuggestedQuestionCard from '@/components/ai-assistant/SuggestedQuestionCard'

const SUGGESTED_QUESTIONS = [
  'Explain backend architecture',
  'Show login API',
  'Which project uses Redis?',
  'Explain Docker setup',
  'Explain authentication flow',
]

const FUTURE_FEATURES = [
  {
    icon: Sparkles,
    title: 'Smart Code Analysis',
    description: 'AI-powered deep analysis of your codebase with context-aware insights.',
  },
  {
    icon: Zap,
    title: 'Real-time Assistance',
    description: 'Get instant answers as you code with live integration.',
  },
  {
    icon: Code,
    title: 'Code Generation',
    description: 'Generate boilerplate, tests, and documentation from natural language.',
  },
  {
    icon: Shield,
    title: 'Security Scanning',
    description: 'Automated vulnerability detection and compliance checks.',
  },
]

function AIAssistantPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="size-5 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            CorpusGuard AI Assistant
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Your intelligent codebase companion. Ask questions about your projects,
          architecture, and get AI-powered insights across all your repositories.
        </p>
      </div>

      <Card className="mb-10 flex min-h-[320px] flex-col items-center justify-center border-dashed p-12">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <Bot className="size-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          Start a conversation
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Ask anything about your codebase, architecture, or development workflow.
          Chat functionality will be available soon.
        </p>
      </Card>

      <section className="mb-10">
        <h2 className="text-lg font-medium text-foreground mb-4">
          Suggested Questions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SUGGESTED_QUESTIONS.map((question) => (
            <SuggestedQuestionCard
              key={question}
              question={question}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-foreground mb-4">
          Coming Soon
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FUTURE_FEATURES.map((feature) => (
            <Card key={feature.title} className="p-5 opacity-70">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <feature.icon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AIAssistantPage
