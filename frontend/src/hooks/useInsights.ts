import { useState, useCallback } from "react";
import { getInsight, type InsightResponse } from "../services/insightsService";

interface UseInsightsResult {
  answer: string;
  chart: InsightResponse["chart"];
  loading: boolean;
  error: string | null;
  askQuestion: (question: string) => Promise<void>;
  reset: () => void;
}

export const useInsights = (): UseInsightsResult => {
  const [answer, setAnswer] = useState("");
  const [chart, setChart] = useState<InsightResponse["chart"]>("none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = useCallback(async (question: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getInsight(question);
      setAnswer(response.answer);
      setChart(response.chart);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch insight";
      setError(message);
      setAnswer("Unable to fetch insights at the moment.");
      setChart("none");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnswer("");
    setChart("none");
    setError(null);
  }, []);

  return { answer, chart, loading, error, askQuestion, reset };
};
