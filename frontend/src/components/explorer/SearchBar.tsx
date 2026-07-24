interface Props {
  query: string
  setQuery: (value: string) => void
  onSearch: () => void
}

export default function SearchBar({ query, setQuery, onSearch }: Props) {
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents"
      />

      <button onClick={onSearch}>Search</button>
    </div>
  )
}
