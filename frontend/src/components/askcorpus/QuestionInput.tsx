import { Loader2 } from "lucide-react";
import { type KeyboardEvent } from "react";

interface QuestionInputProps {
  value: string;
  onChange: (question: string) => void;
  onAsk: (question: string) => void;
  loading?: boolean;
}

const QuestionInput = ({ value, onChange, onAsk, loading = false }: QuestionInputProps) => {
  const handleSubmit = () => {
    if (!value.trim()) {
      return;
    }

    onAsk(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--app-strong)]">Ask a question</h2>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Explore the corpus with natural language insights.
          </p>
        </div>
      </div>

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about the Corpus Platform..."
        className="mt-5 w-full rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-4 py-3 text-sm text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-text-soft)] focus:border-[var(--app-accent)]"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--app-text-soft)]">
          Try asking for the top languages, media breakdown, or contributor rankings.
        </p>
        <button
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
          className="rounded-2xl bg-[var(--app-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--app-surface)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Asking...
            </span>
          ) : (
            "Ask Corpus"
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestionInput;