import { useEffect, useState } from 'react'

import { getCorpusExplorerSummary } from '@/services/corpusExplorerService'
import type { CorpusExplorerSummary } from '@/types/corpusExplorer'

const defaultSummary: CorpusExplorerSummary = {
  totalRecords: 0,
  totalLanguages: 0,
  totalCategories: 0,
  profileName: '—',
}

export function useCorpusExplorerSummary() {
  const [summary, setSummary] = useState<CorpusExplorerSummary>(defaultSummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSummary() {
      setLoading(true)
      setError('')

      try {
        const result = await getCorpusExplorerSummary()
        if (isMounted) {
          setSummary(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load dashboard summary')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadSummary()

    return () => {
      isMounted = false
    }
  }, [])

  return { summary, loading, error }
}
