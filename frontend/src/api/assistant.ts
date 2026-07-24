const BASE_URL = 'http://127.0.0.1:8000'

type AssistantRecord = Record<string, unknown>

export async function askAssistant(record: AssistantRecord, question: string) {
  const res = await fetch(`${BASE_URL}/assistant/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      record,
      question,
    }),
  })

  return await res.json()
}
