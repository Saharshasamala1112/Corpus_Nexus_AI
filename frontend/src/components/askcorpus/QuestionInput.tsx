import { useState } from "react";

interface QuestionInputProps {
  onAsk: (question: string) => void;
}

const QuestionInput = ({ onAsk }: QuestionInputProps) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim()) {
      return;
    }

    onAsk(question);
    setQuestion("");
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-lg shadow-black/20 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Ask a question</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Explore the corpus with natural language insights.
          </p>
        </div>
      </div>

      <textarea
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about the Corpus Platform..."
        className="mt-5 w-full rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-violet-500"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Try asking for the top languages, media breakdown, or contributor rankings.
        </p>
        <button
          onClick={handleSubmit}
          className="rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Ask Corpus
        </button>
      </div>
    </div>
  );
};

export default QuestionInput;