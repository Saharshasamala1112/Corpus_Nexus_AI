interface StatCardProps {
  title: string
  value: string
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
      <h3 className="text-sm text-gray-500">{title}</h3>

      <p className="mt-3 text-3xl font-bold text-slate-800">{value}</p>
    </div>
  )
}

export default StatCard
