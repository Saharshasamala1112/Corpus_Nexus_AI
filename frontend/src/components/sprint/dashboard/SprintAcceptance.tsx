import SprintCard from "./SprintCard";

interface SprintAcceptanceProps {
    acceptanceCriteria: string[];
}

export default function SprintAcceptance({
    acceptanceCriteria,
}: SprintAcceptanceProps) {
    return (
        <SprintCard title="Acceptance Criteria">
            <div className="space-y-4">
                {acceptanceCriteria.map((criterion, index) => (
                    <div
                        key={`${index}-${criterion}`}
                        className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-md"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                            ✓
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-emerald-900">
                                    Criteria {index + 1}
                                </h3>

                                <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                                    Required
                                </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-700">
                                {criterion}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </SprintCard>
    );
}
