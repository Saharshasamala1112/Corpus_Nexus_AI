interface FilterPanelProps {
  selectedLanguage: string
  selectedCategory: string
  onLanguageChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

const languages = ['All', 'English', 'French', 'Spanish', 'Arabic']
const categories = ['All', 'Policy', 'Research', 'Legal', 'Operations']

export default function FilterPanel({
  selectedLanguage,
  selectedCategory,
  onLanguageChange,
  onCategoryChange,
}: FilterPanelProps) {
  return (
    <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-lg shadow-black/20 md:grid-cols-2">
      <label className="space-y-2 text-sm text-zinc-300">
        <span className="block font-medium text-zinc-100">Language</span>
        <select
          value={selectedLanguage}
          onChange={(event) => onLanguageChange(event.target.value)}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-500"
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm text-zinc-300">
        <span className="block font-medium text-zinc-100">Category</span>
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
