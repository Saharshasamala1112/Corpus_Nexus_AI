import { useEffect, useCallback } from 'react'

interface ShortcutHandlers {
  newChat?: () => void
  search?: () => void
  toggleSidebar?: () => void
  toggleContext?: () => void
  stopGeneration?: () => void
}

function isModKey(e: KeyboardEvent): boolean {
  return e.metaKey || e.ctrlKey
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isModKey(e) && e.key === 'n') {
        e.preventDefault()
        handlers.newChat?.()
      }
      if (isModKey(e) && e.key === 'k') {
        e.preventDefault()
        handlers.search?.()
      }
      if (isModKey(e) && e.key === 'b') {
        e.preventDefault()
        handlers.toggleSidebar?.()
      }
      if (isModKey(e) && e.key === '.') {
        e.preventDefault()
        handlers.toggleContext?.()
      }
      if (e.key === 'Escape') {
        handlers.stopGeneration?.()
      }
    },
    [handlers]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
