export const APP_NAME = 'CorpusGuard AI'
export const APP_DESCRIPTION = 'Intelligent codebase companion'

export const SUGGESTED_PROMPTS = [
  'Explain backend architecture',
  'Which project uses Redis?',
  'Explain login flow',
  'Show PostgreSQL schema',
  'Explain Docker setup',
  'How do I deploy this project?',
] as const

export const CONTEXT_SECTIONS = [
  { type: 'document' as const, label: 'Retrieved Documents', count: 3 },
  { type: 'project' as const, label: 'Related Projects', count: 2 },
  { type: 'repository' as const, label: 'Repository', count: 4 },
  { type: 'api' as const, label: 'APIs', count: 6 },
  { type: 'database' as const, label: 'Database Tables', count: 8 },
  { type: 'docker' as const, label: 'Docker Files', count: 2 },
  { type: 'architecture' as const, label: 'Architecture Documents', count: 3 },
] as const

export const KEYBOARD_SHORTCUTS = {
  NEW_CHAT: 'mod+n',
  SEARCH: 'mod+k',
  TOGGLE_SIDEBAR: 'mod+b',
  TOGGLE_CONTEXT: 'mod+.',
  SEND_MESSAGE: 'Enter',
  STOP_GENERATION: 'Escape',
} as const

export const STREAMING_DELAY = 30
export const TYPING_INDICATOR_DELAY = 800
