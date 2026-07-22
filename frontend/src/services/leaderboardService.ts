import api from "../api/axios";

export interface LeaderboardUser {
  rank: number;
  user_id: string;
  user_name: string;
  total_points: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  current_user_rank: LeaderboardUser | null;
}

export const getLeaderboard = async (
  categoryId?: string,
): Promise<LeaderboardUser[]> => {
  try {
    const params = categoryId ? `?category_id=${categoryId}` : "";
    const response = await api.get<LeaderboardResponse>(
      `/points/leaderboard${params}`,
    );
    return response.data.leaderboard;
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
};
