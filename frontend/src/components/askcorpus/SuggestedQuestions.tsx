const suggestedQuestions = [
  'Which language has the highest number of recordings?',
  'What is the media type distribution?',
  'Show me the top contributors',
  'How many contributors are there?',
  'What is the total number of records?',
]

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

const SuggestedQuestions = ({ onSelect }: SuggestedQuestionsProps) => {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-lg shadow-black/20 sm:p-8">
      <h2 className="text-lg font-semibold text-white">Suggested Questions</h2>
      <p className="mt-1 text-sm text-zinc-400">Start with one of these common prompts.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className="rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-violet-500 hover:text-white"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestedQuestions
