export interface LeaderboardUser {
  rank: number;
  user_id: string;
  user_name: string;
  total_points: number;
}

export interface CategoryLeaderboardResponse {
  leaderboard: LeaderboardUser[];
  current_user_rank: LeaderboardUser | null;
}
