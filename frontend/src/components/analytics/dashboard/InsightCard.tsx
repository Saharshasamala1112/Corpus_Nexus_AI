interface InsightCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const InsightCard = ({ title, value, description }: InsightCardProps) => {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
      <h3 className="text-sm font-medium text-blue-600">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default InsightCard;
