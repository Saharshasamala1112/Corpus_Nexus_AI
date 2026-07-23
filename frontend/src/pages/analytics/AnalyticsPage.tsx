import { useEffect, useState } from 'react'

import MainLayout from '../../layouts/MainLayout'
import StatCard from '../../components/analytics/dashboard/StatCard'

import { getDashboardStats, type DashboardStats } from '../../services/dashboardService'

import { getLeaderboard } from '../../services/leaderboardService'

const AnalyticsPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRecords: 0,
    totalLanguages: 0,
  })

  const [contributors, setContributors] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const dashboardStats = await getDashboardStats()
        setStats(dashboardStats)

        const leaderboard = await getLeaderboard()
        setContributors(leaderboard.length)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8 text-lg">Loading analytics...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Analytics</h1>
          <p className="mt-2 text-gray-500">Live analytics from the Indic Corpus Platform.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Total Records" value={stats.totalRecords.toLocaleString()} />
          <StatCard title="Contributors" value={contributors.toLocaleString()} />
          <StatCard title="Languages" value={stats.totalLanguages.toLocaleString()} />
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Dataset Summary</h2>
          <ul className="list-disc space-y-2 pl-6 text-slate-700">
            <li>Total Records: {stats.totalRecords.toLocaleString()}</li>
            <li>Total Languages: {stats.totalLanguages.toLocaleString()}</li>
            <li>Active Contributors: {contributors.toLocaleString()}</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  )
}

export default AnalyticsPage
