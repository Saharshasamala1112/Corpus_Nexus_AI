import { useCallback, useRef } from 'react'
import { MOCK_AI_RESPONSES } from '@/lib/mock-data'
import { STREAMING_DELAY } from '@/utils/constants'

interface UseStreamingSimulationOptions {
  onComplete?: (fullText: string) => void
}

export function useStreamingSimulation(options: UseStreamingSimulationOptions = {}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isCancelledRef = useRef(false)

  const findResponse = useCallback((query: string): string => {
    const lower = query.toLowerCase()
    for (const [key, response] of Object.entries(MOCK_AI_RESPONSES)) {
      if (lower.includes(key) || key.includes(lower)) {
        return response
      }
    }
    return `## Analysis Complete\n\nI've analyzed your query about **"${query}"**.\n\nBased on the codebase context, here are the key findings:\n\n1. The relevant code is located in the backend module structure\n2. The implementation follows the established patterns in the codebase\n3. Dependencies and related files have been identified\n\nWould you like me to dive deeper into any specific aspect?`
  }, [])

  const simulateStreaming = useCallback(
    async (
      query: string,
      onChunk: (chunk: string, fullText: string) => void
    ) => {
      isCancelledRef.current = false
      const fullResponse = findResponse(query)
      const words = fullResponse.split(/(\s+)/)
      let accumulated = ''

      for (let i = 0; i < words.length; i++) {
        if (isCancelledRef.current) break

        accumulated += words[i]
        onChunk(accumulated, accumulated)

        await new Promise<void>((resolve) => {
          timeoutRef.current = setTimeout(resolve, STREAMING_DELAY)
        })
      }

      if (!isCancelledRef.current) {
        options.onComplete?.(accumulated)
      }

      return accumulated
    },
    [findResponse, options]
  )

  const stopStreaming = useCallback(() => {
    isCancelledRef.current = true
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  return { simulateStreaming, stopStreaming }
}
