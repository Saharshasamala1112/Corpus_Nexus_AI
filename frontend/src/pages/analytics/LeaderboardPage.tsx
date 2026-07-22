import MainLayout from "../../layouts/MainLayout";
import LeaderboardTable from "../../components/analytics/dashboard/LeaderboardTable";

const LeaderboardPage = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Leaderboard</h1>
          <p className="mt-2 text-gray-500">
            Top contributors based on points and contributions.
          </p>
        </div>

        <LeaderboardTable />
      </div>
    </MainLayout>
  );
};

export default LeaderboardPage;
