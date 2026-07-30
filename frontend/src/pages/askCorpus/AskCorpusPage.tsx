import { useRef, useState } from "react";

import AnswerCard from "../../components/askcorpus/AnswerCard";
import QuestionInput from "../../components/askcorpus/QuestionInput";
import SuggestedQuestions from "../../components/askcorpus/SuggestedQuestions";

import MediaTypeChart from "../../components/corpusInsights/MediaTypeChart";
import LanguageChart from "../../components/corpusInsights/LanguageChart";

import { getInsight } from "../../services/insightsService";

const AskCorpusPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chart, setChart] = useState("none");
  const answerRef = useRef<HTMLDivElement | null>(null);

  const askQuestion = async (nextQuestion: string) => {
    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion) {
      return;
    }

    setQuestion(nextQuestion);
    setLoading(true);
    setError("");
    setAnswer("");
    setChart("none");

    try {
      const response = await getInsight(trimmedQuestion);

      setAnswer(response.answer);
      setChart(response.chart);

      requestAnimationFrame(() => {
        answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (error) {
      console.error("Failed to fetch insight:", error);
      setAnswer("");
      setChart("none");
      setError("Sorry, I couldn't fetch an answer right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedSelect = (nextQuestion: string) => {
    setQuestion(nextQuestion);
    void askQuestion(nextQuestion);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-surface)_0%,var(--app-surface-secondary)_55%,var(--app-bg)_100%)] p-6 shadow-[0_24px_70px_var(--app-accent-soft)] sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[var(--app-accent)]">
            Ask Corpus
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-strong)] sm:text-4xl">
            Explore the corpus with natural language.
          </h1>
          <p className="mt-3 text-base leading-7 text-[var(--app-text-muted)] sm:text-lg">
            Ask questions about recordings, languages, media types, and contributors while staying inside the shared Corpus Nexus experience.
          </p>
        </div>
      </div>

      <QuestionInput
        value={question}
        onChange={setQuestion}
        onAsk={askQuestion}
        loading={loading}
      />

      <SuggestedQuestions onSelect={handleSuggestedSelect} />

      {error ? (
        <div className="rounded-3xl border border-[color:var(--app-accent-soft)] bg-[color:var(--app-accent-soft)] p-4 text-sm text-[var(--app-accent)]">
          {error}
        </div>
      ) : null}

      <div ref={answerRef}>
        {answer ? <AnswerCard answer={answer} /> : null}
      </div>

      {chart === "mediaType" && (
        <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[var(--app-strong)]">
              Recordings by Media Type
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">
              Distribution of recordings across the available media formats.
            </p>
          </div>

          <MediaTypeChart />
        </div>
      )}

      {chart === "language" && (
        <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[var(--app-strong)]">
              Top Languages by Record Count
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">
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