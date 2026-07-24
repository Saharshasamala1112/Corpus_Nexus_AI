import { useState } from "react";
import {
  getInsight,
  type InsightResponse,
} from "../services/insightsService";

export const useInsights = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] =
    useState<InsightResponse | null>(null);

  const askQuestion = async (question: string) => {
    setLoading(true);

    try {
      const result = await getInsight(question);
      setResponse(result);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    response,
    askQuestion,
  };
};