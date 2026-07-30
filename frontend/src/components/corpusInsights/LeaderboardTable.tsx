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
      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/80 p-6 text-sm text-[var(--app-text-muted)] shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px]">
          <thead className="bg-[var(--app-surface-secondary)] text-left text-sm text-[var(--app-text-muted)]">
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
                className="border-t border-[var(--app-border)] text-sm text-[var(--app-text)] transition hover:bg-[var(--app-surface-secondary)]/80"
              >
                <td className="px-6 py-4">{user.rank}</td>

                <td className="px-6 py-4 font-medium text-[var(--app-strong)]">
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
    </div>
  );
};

export default LeaderboardTable;