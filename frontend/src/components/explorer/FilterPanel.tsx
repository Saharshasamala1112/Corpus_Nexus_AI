interface LanguageOption {
  code: string
  name: string
}

interface CategoryOption {
  id: string | number
  title: string
}

interface Props {
  languages: LanguageOption[]
  categories: CategoryOption[]
}

export default function FilterPanel({ languages, categories }: Props) {
  return (
    <div>
      <h2>Languages</h2>

      <select>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <h2>Categories</h2>

      <select>
        {categories.map((cat) => (
          <option key={cat.id}>{cat.title}</option>
        ))}
      </select>
    </div>
  )
}
