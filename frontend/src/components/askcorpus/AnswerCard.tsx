interface AnswerCardProps {
  answer: string
}

const AnswerCard = ({ answer }: AnswerCardProps) => {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-lg shadow-black/20 sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-2 text-violet-300">
          <span className="text-lg">✦</span>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">Insight</h2>
          <p className="text-sm text-zinc-400">Generated from the current corpus data.</p>
        </div>
      </div>

      <p className="whitespace-pre-line text-base leading-7 text-zinc-300">{answer}</p>
    </div>
  )
}

export default AnswerCard
