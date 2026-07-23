import { useState } from 'react'

interface QuestionInputProps {
  onAsk: (question: string) => void
}

const QuestionInput = ({ onAsk }: QuestionInputProps) => {
  const [question, setQuestion] = useState('')

  const handleSubmit = () => {
    if (!question.trim()) {
      return
    }

    onAsk(question)
    setQuestion('')
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <textarea
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about the Corpus Platform..."
        className="w-full rounded-lg border p-4 outline-none focus:border-blue-500"
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Ask Corpus
        </button>
      </div>
    </div>
  )
}

export default QuestionInput
