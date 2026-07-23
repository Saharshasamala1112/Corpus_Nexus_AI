interface ChartCardProps {
  title: string
  children: React.ReactNode
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </div>
  )
}

export default ChartCard
