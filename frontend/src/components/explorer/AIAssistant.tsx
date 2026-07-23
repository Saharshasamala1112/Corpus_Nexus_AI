import { useState } from 'react'
import { askAssistant } from '../../services/api'

interface ExplorerRecord {
  [key: string]: unknown
  title?: string
  username?: string
  description?: string
  language?: string
  category?: string
  uid?: string | number
}

interface AIAssistantProps {
  record: ExplorerRecord
}

export default function AIAssistant({ record }: AIAssistantProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAsk() {
    if (!question.trim()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = (await askAssistant(record, question)) as {
        answer?: string
        detail?: string
      }
      setAnswer(data.answer || data.detail || 'No answer returned.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unable to get assistant reply.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>AI Assistant</h3>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about this record"
        style={{ width: '100%', minHeight: 80, marginBottom: 10 }}
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Loading...' : 'Ask'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {answer && (
        <p>
          <strong>Answer:</strong> {answer}
        </p>
      )}
    </div>
  )
}
