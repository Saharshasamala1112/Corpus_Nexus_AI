import { useState } from "react";

import AnswerCard from "../../components/askcorpus/AnswerCard";
import QuestionInput from "../../components/askcorpus/QuestionInput";
import SuggestedQuestions from "../../components/askcorpus/SuggestedQuestions";

import MediaTypeChart from "../../components/corpusInsights/MediaTypeChart";
import LanguageChart from "../../components/corpusInsights/LanguageChart";

import { getInsight } from "../../services/insightsService";

const AskCorpusPage = () => {
  const [answer, setAnswer] = useState("");
  const [chart, setChart] = useState("none");

  const askQuestion = async (question: string) => {
    try {
      const response = await getInsight(question);

      setAnswer(response.answer);
      setChart(response.chart);
    } catch (error) {
      console.error("Failed to fetch insight:", error);

      setAnswer("Unable to fetch insights at the moment.");
      setChart("none");
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-400">
            Ask Corpus
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Explore the corpus with natural language.
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-400 sm:text-lg">
            Ask questions about recordings, languages, media types, and contributors while staying inside the shared Corpus Nexus experience.
          </p>
        </div>
      </div>

      <QuestionInput onAsk={askQuestion} />

      <SuggestedQuestions onSelect={askQuestion} />

      {answer && <AnswerCard answer={answer} />}

      {chart === "mediaType" && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-lg shadow-black/20 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recordings by Media Type
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Distribution of recordings across the available media formats.
            </p>
          </div>

          <MediaTypeChart />
        </div>
      )}

      {chart === "language" && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-lg shadow-black/20 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Top Languages by Record Count
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              The most represented languages in the current dataset.
            </p>
          </div>

          <LanguageChart />
        </div>
      )}
    </div>
  );
};

export default AskCorpusPage;