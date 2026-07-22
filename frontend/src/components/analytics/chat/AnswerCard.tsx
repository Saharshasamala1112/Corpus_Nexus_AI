interface AnswerCardProps {
  answer: string;
}

const AnswerCard = ({ answer }: AnswerCardProps) => {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">🤖</span>

        <h2 className="text-xl font-semibold text-blue-700">
          Insight
        </h2>
      </div>

      <p className="leading-7 text-slate-700">
        {answer}
      </p>
    </div>
  );
};

export default AnswerCard;