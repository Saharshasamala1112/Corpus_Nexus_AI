import api from "../api/axios";

export interface LeaderboardUser {
  rank: number;
  user_id: string;
  user_name: string;
  total_points: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
}

export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
  const response = await api.get<LeaderboardResponse>(
    "/points/leaderboard",
  );

  return response.data.leaderboard;
};