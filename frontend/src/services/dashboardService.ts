import { getRecords } from './recordsService'
import { getLanguages } from './languageService'
import { getLeaderboard } from './leaderboardService'

export interface DashboardStats {
  totalRecords: number
  totalLanguages: number
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [records, languages] = await Promise.all([getRecords(0, 1000), getLanguages()])

    return {
      totalRecords: records.length,
      totalLanguages: languages.length,
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return { totalRecords: 0, totalLanguages: 0 }
  }
}

export const getContributorCount = async (): Promise<number> => {
  try {
    const leaderboard = await getLeaderboard()
    return leaderboard.length
  } catch (error) {
    console.error('Failed to fetch contributor count:', error)
    return 0
  }
}
