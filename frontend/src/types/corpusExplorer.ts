export interface DownloadLink {
  label: string
  url: string
}

export interface CorpusRecord {
  id: string | number
  title: string
  description: string
  language: string
  category: string
  metadata: Record<string, string | number | boolean | null>
  downloadLinks?: DownloadLink[]
}

export interface LanguageItem {
  id: string
  name: string
  count?: number
}

export interface CategoryItem {
  id: string
  name: string
  count?: number
}

export interface CorpusProfile {
  username: string
  name: string
  phone: string
  email: string
  organisation: string
  profession: string
  roles: string[]
  location: string
}

export interface AssistantAnswer {
  answer: string
}

export interface CorpusExplorerSummary {
  totalRecords: number
  totalLanguages: number
  totalCategories: number
  profileName: string
}
