import SprintCard from './SprintCard'

interface SprintRiskProps {
  risks: string[]
}

export default function SprintRisk({ risks }: SprintRiskProps) {
  return (
    <SprintCard title="Sprint Risks">
      <div className="space-y-4">
        {risks.map((risk, index) => (
          <div
            key={`${index}-${risk}`}
            className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 transition-all duration-200 hover:border-amber-300 hover:bg-amber-100 hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-white">
              ⚠
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-amber-900">Risk {index + 1}</h3>

                <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
                  Medium
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-700">{risk}</p>
            </div>
          </div>
        ))}
      </div>
    </SprintCard>
  )
}
