import MainLayout from "../../layouts/MainLayout";
import LeaderboardTable from "../../components/corpusInsights/LeaderboardTable";

const LeaderboardPage = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[var(--app-strong)]">
            Leaderboard
          </h1>

          <p className="mt-2 text-[var(--app-text-muted)]">
            Top contributors based on points and contributions.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
          <LeaderboardTable />
        </div>
      </div>
    </MainLayout>
  );
};

export default LeaderboardPage;