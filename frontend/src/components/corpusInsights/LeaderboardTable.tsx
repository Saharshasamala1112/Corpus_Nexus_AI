import { useEffect, useState } from "react";

import { getLeaderboard } from "../../services/leaderboardService";
import type {
  LeaderboardUser,
} from "../../services/leaderboardService";

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-4 text-left">Rank</th>
            <th className="px-6 py-4 text-left">User</th>
            <th className="px-6 py-4 text-left">Points</th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((user) => (
            <tr
              key={user.user_id}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-6 py-4">{user.rank}</td>

              <td className="px-6 py-4 font-medium">
                {user.user_name}
              </td>

              <td className="px-6 py-4">
                {Math.round(user.total_points).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;