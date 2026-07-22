import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/useChatStore'

interface SearchInputProps {
  onSearch: (query: string) => void
}

function SearchInput({ onSearch }: SearchInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { sidebarOpen } = useChatStore()

  useEffect(() => {
    if (!sidebarOpen) return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [sidebarOpen])

  const handleChange = (val: string) => {
    setValue(val)
    onSearch(val)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
    inputRef.current?.focus()
  }

  if (!sidebarOpen) return null

  return (
    <div className="relative px-3">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search conversations..."
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-8 rounded-lg border border-input bg-muted/50 pl-8 pr-8 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={handleClear}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  )
}

export default SearchInput
