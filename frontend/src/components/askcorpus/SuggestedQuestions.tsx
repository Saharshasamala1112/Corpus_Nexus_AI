const suggestedQuestions = [
  "Which language has the highest number of recordings?",
  "What is the media type distribution?",
  "Show me the top contributors",
  "How many contributors are there?",
  "What is the total number of records?",
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SuggestedQuestions = ({
  onSelect,
}: SuggestedQuestionsProps) => {
  return (
    <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
      <h2 className="text-lg font-semibold text-[var(--app-strong)]">Suggested Questions</h2>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">
        Start with one of these common prompts.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--app-text)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-strong)]"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;