import { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import EmptyState from '@/components/corpusExplorer/EmptyState'
import FilterPanel from '@/components/corpusExplorer/FilterPanel'
import Loader from '@/components/corpusExplorer/Loader'
import ResultCard from '@/components/corpusExplorer/ResultCard'
import SearchBar from '@/components/corpusExplorer/SearchBar'
import { searchRecords } from '@/services/corpusExplorer/corpus'
import type { CorpusRecord } from '@/types/corpusExplorer'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [records, setRecords] = useState<CorpusRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadRecords = useCallback(async (nextQuery: string) => {
    setLoading(true)
    setError('')

    try {
      const result = await searchRecords(nextQuery)
      setRecords(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load records')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initialLoad = async () => {
      await loadRecords('*')
    }

    void initialLoad()
  }, [loadRecords])

  const filteredRecords = records.filter((record) => {
    const matchesLanguage = selectedLanguage === 'All' || record.language === selectedLanguage
    const matchesCategory = selectedCategory === 'All' || record.category === selectedCategory
    const matchesQuery =
      !query ||
      [record.title, record.description, record.language, record.category]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())

    return matchesLanguage && matchesCategory && matchesQuery
  })

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Search corpus</h1>
            <p className="text-sm text-zinc-400">
              Find records across languages, categories, and metadata.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => void loadRecords(query || '*')}
          loading={loading}
        />

        <FilterPanel
          selectedLanguage={selectedLanguage}
          selectedCategory={selectedCategory}
          onLanguageChange={setSelectedLanguage}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          title="No records found"
          description="Try another search phrase or broaden the filters to discover more results."
        />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredRecords.map((record) => (
            <ResultCard key={record.id} record={record} />
          ))}
        </section>
      )}
    </div>
  )
}
