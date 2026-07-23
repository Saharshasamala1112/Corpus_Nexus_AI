import { Bot, Sparkles, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { SUGGESTED_PROMPTS } from '@/utils/constants'

interface WelcomeViewProps {
  onSendPrompt: (prompt: string) => void
}

function WelcomeView({ onSendPrompt }: WelcomeViewProps) {
  const handlePrompt = (prompt: string) => {
    onSendPrompt(prompt)
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center text-center max-w-2xl"
      >
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Bot className="size-8 text-primary" />
        </div>

        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
          CorpusGuard AI
        </h1>
        <p className="mb-10 text-muted-foreground leading-relaxed max-w-lg">
          Intelligent codebase companion powered by enterprise AI. Ask questions about your
          architecture, code, and infrastructure.
        </p>

        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <motion.div
              key={prompt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            >
              <button
                onClick={() => handlePrompt(prompt)}
                className="group flex h-full w-full items-start gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm transition-all hover:border-primary/40 hover:bg-accent-muted hover:shadow-sm"
              >
                <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {prompt}
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3" />
          <span>Powered by CorpusGuard AI Enterprise</span>
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeView
