import { useEffect, useState } from 'react'
import { Globe2 } from 'lucide-react'

import LanguageCard from '@/components/corpusExplorer/LanguageCard'
import Loader from '@/components/corpusExplorer/Loader'
import EmptyState from '@/components/corpusExplorer/EmptyState'
import { getLanguages } from '@/services/corpusExplorer/corpus'
import type { LanguageItem } from '@/types/corpusExplorer'

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<LanguageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLanguages() {
      try {
        const result = await getLanguages()
        setLanguages(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load languages')
      } finally {
        setLoading(false)
      }
    }

    void loadLanguages()
  }, [])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Languages</h1>
            <p className="text-sm text-zinc-400">
              Browse all available languages in the corpus network.
            </p>
          </div>
        </div>
      </div>

      {languages.length === 0 ? (
        <EmptyState
          title="No languages available"
          description="The language catalog is empty right now."
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {languages.map((language) => (
            <LanguageCard key={language.id ?? language.name} language={language} />
          ))}
        </section>
      )}
    </div>
  )
}
