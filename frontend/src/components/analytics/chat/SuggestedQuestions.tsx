import { suggestedQuestions } from '../../../mock/questions'

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

const SuggestedQuestions = ({ onSelect }: SuggestedQuestionsProps) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Suggested Questions</h2>

      <div className="flex flex-wrap gap-3">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 transition hover:bg-blue-100"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestedQuestions
