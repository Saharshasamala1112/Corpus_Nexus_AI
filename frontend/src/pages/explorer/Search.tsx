import { useState } from 'react'
import { searchRecords } from '../../services/api'
import ResultCard from '../../components/explorer/ResultCard'

interface ExplorerRecord {
  uid?: string | number
  title?: string
  description?: string
  language?: string
  creator?: string
  username?: string
  media_type?: string
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ExplorerRecord[]>([])
  const [error, setError] = useState('')

  async function handleSearch() {
    try {
      setError('')

      const data = await searchRecords(query)

      console.log('Received:', data)

      setResults(Array.isArray(data) ? (data as ExplorerRecord[]) : [])
    } catch (err) {
      console.error(err)
      setError('Unable to fetch records')
    }
  }

  return (
    <div className="container">
      <h1>Search Page</h1>

      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here" />

      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {results.length === 0 ? (
          <p>No records found.</p>
        ) : (
          results.map((item, index) => <ResultCard key={String(item.uid ?? index)} item={item} />)
        )}
      </div>
    </div>
  )
}
