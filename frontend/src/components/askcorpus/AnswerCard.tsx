interface AnswerCardProps {
  answer: string;
}

const AnswerCard = ({ answer }: AnswerCardProps) => {
  return (
    <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl border border-[var(--app-accent-soft)] bg-[var(--app-accent-soft)] p-2 text-[var(--app-accent)]">
          <span className="text-lg">✦</span>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[var(--app-strong)]">Insight</h2>
          <p className="text-sm text-[var(--app-text-muted)]">Generated from the current corpus data.</p>
        </div>
      </div>

      <p className="whitespace-pre-line text-base leading-7 text-[var(--app-text)]">
        {answer}
      </p>
    </div>
  );
};

export default AnswerCard;