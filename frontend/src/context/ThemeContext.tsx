import { createContext } from 'react'

type Theme = 'light' | 'dark' | 'system'

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'dark',
})
