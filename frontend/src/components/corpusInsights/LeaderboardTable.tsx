import { useEffect, useState } from 'react'

import { getLeaderboard } from '../../services/leaderboardService'
import type { LeaderboardUser } from '../../services/leaderboardService'

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard()
        setLeaderboard(data)
      } catch (error) {
        console.error('Failed to load leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400 shadow-sm">
        Loading leaderboard...
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px]">
          <thead className="bg-slate-950/80 text-left text-sm text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Points</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((user) => (
              <tr
                key={user.user_id}
                className="border-t border-slate-800/80 text-sm text-slate-300 transition hover:bg-slate-800/60"
              >
                <td className="px-6 py-4">{user.rank}</td>

                <td className="px-6 py-4 font-medium text-white">{user.user_name}</td>

                <td className="px-6 py-4">{Math.round(user.total_points).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeaderboardTable
