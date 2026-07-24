interface StatCardProps {
  title: string;
  value: string;
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm transition hover:shadow-md">
      <h3 className="text-sm text-muted-foreground">{title}</h3>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
};

export default StatCard;