import { useState } from 'react'
import { Bot, Send } from 'lucide-react'

import { askAssistant } from '@/services/corpusExplorer/assistant'
import type { CorpusRecord } from '@/types/corpusExplorer'

interface AIAssistantProps {
  record: CorpusRecord
}

export default function AIAssistant({ record }: AIAssistantProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    if (!question.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await askAssistant(record, question)
      setAnswer(response.answer)
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : 'Unable to answer right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">AI Assistant</h3>
          <p className="text-sm text-zinc-400">Ask contextual questions about this record.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question about the record"
          className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-500"
        />
        <button
          type="button"
          onClick={handleAsk}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Loading...' : 'Ask'}
        </button>
      </div>

      {answer ? (
        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-200">
          {answer}
        </div>
      ) : null}
    </section>
  )
}
