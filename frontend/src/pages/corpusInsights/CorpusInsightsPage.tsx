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
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-400">
          Corpus Insights
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Live analytics for your corpus workspace.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          Monitor corpus growth, language coverage, media distribution, and contributor activity from one page.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 text-center text-zinc-400 shadow-lg shadow-black/20">
          Loading analytics...
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard title="Total Records" value={stats.totalRecords.toLocaleString()} />
            <StatCard title="Total Languages" value={stats.totalLanguages.toLocaleString()} />
            <StatCard title="Contributors" value={contributors.toLocaleString()} />
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-lg shadow-black/20 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Language Analytics</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Explore the distribution of recordings across languages.
              </p>
            </div>
            <LanguageChart />
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-lg shadow-black/20 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Media Type Analytics</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Review the representation of audio, video, image, text, and document recordings.
              </p>
            </div>
            <MediaTypeChart />
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-lg shadow-black/20 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Top Contributors</h2>
              <p className="mt-1 text-sm text-zinc-400">
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
