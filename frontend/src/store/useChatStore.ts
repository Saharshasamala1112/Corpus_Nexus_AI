import { useCallback, useSyncExternalStore } from 'react'

interface ChatStore {
  isGenerating: boolean
  isStreaming: boolean
  sidebarOpen: boolean
  contextPanelOpen: boolean
  searchQuery: string
  aiDrawerOpen: boolean
}

let state: ChatStore = {
  isGenerating: false,
  isStreaming: false,
  sidebarOpen: true,
  contextPanelOpen: true,
  searchQuery: '',
  aiDrawerOpen: false,
}

let listeners: Array<() => void> = []

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot(): ChatStore {
  return state
}

function setState(updater: (prev: ChatStore) => ChatStore) {
  state = updater(state)
  emitChange()
}

export function useChatStore() {
  const store = useSyncExternalStore(subscribe, getSnapshot)

  const setGenerating = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, isGenerating: val }))
  }, [])

  const setStreaming = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, isStreaming: val }))
  }, [])

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))
  }, [])

  const toggleContextPanel = useCallback(() => {
    setState((prev) => ({ ...prev, contextPanelOpen: !prev.contextPanelOpen }))
  }, [])

  const setSidebarOpen = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, sidebarOpen: val }))
  }, [])

  const setContextPanelOpen = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, contextPanelOpen: val }))
  }, [])

  const setSearchQuery = useCallback((val: string) => {
    setState((prev) => ({ ...prev, searchQuery: val }))
  }, [])

  const toggleAiDrawer = useCallback(() => {
    setState((prev) => ({ ...prev, aiDrawerOpen: !prev.aiDrawerOpen }))
  }, [])

  const setAiDrawerOpen = useCallback((val: boolean) => {
    setState((prev) => ({ ...prev, aiDrawerOpen: val }))
  }, [])

  return {
    ...store,
    setGenerating,
    setStreaming,
    toggleSidebar,
    toggleContextPanel,
    setSidebarOpen,
    setContextPanelOpen,
    setSearchQuery,
    toggleAiDrawer,
    setAiDrawerOpen,
  }
}
