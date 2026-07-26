import { useEffect, useState } from "react";

import LanguageChart from "../../components/corpusInsights/LanguageChart";
import LeaderboardTable from "../../components/corpusInsights/LeaderboardTable";
import MediaTypeChart from "../../components/corpusInsights/MediaTypeChart";
import StatCard from "../../components/corpusInsights/StatCard";

import {
  getDashboardStats,
  type DashboardStats,
} from "../../services/dashboardService";
import { getLeaderboard } from "../../services/leaderboardService";

function CorpusInsightsPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRecords: 0,
    totalLanguages: 0,
  });
  const [contributors, setContributors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);

        const leaderboard = await getLeaderboard();
        setContributors(leaderboard.length);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-surface)_0%,var(--app-surface-secondary)_55%,var(--app-bg)_100%)] p-6 shadow-[0_24px_70px_var(--app-accent-soft)] sm:p-8 lg:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-[var(--app-accent)]">
          Corpus Insights
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-strong)] sm:text-4xl">
          Live analytics for your corpus workspace.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--app-text-muted)] sm:text-lg">
          Monitor corpus growth, language coverage, media distribution, and contributor activity from one page.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)]/80 p-8 text-center text-[var(--app-text-muted)] shadow-[0_16px_40px_var(--app-accent-soft)]">
          Loading analytics...
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard title="Total Records" value={stats.totalRecords.toLocaleString()} />
            <StatCard title="Total Languages" value={stats.totalLanguages.toLocaleString()} />
            <StatCard title="Contributors" value={contributors.toLocaleString()} />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-[var(--app-strong)]">Language Analytics</h2>
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                  Explore the distribution of recordings across languages.
                </p>
              </div>
              <LanguageChart />
            </div>

            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-[var(--app-strong)]">Media Type Analytics</h2>
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                  Review the representation of audio, video, image, text, and document recordings.
                </p>
              </div>
              <MediaTypeChart />
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[var(--app-strong)]">Top Contributors</h2>
              <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                See the highest-ranked contributors in the current leaderboard.
              </p>
            </div>
            <LeaderboardTable />
          </section>
        </>
      )}
    </div>
  );
}

export default CorpusInsightsPage;
