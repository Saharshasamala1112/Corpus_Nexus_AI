import SprintCard from "./SprintCard";

interface SprintTimelineProps {
    timeline: string[];
}

export default function SprintTimeline({ timeline }: SprintTimelineProps) {
    return (
        <SprintCard title="Sprint Timeline">
            <div className="relative ml-3 border-l-2 border-blue-200">
                {timeline.map((item, index) => (
                    <div key={`${index}-${item}`} className="relative mb-8 ml-6">
                        <div className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow">
                            {index + 1}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:shadow-md">
                            <p className="text-sm font-medium leading-6 text-slate-700">
                                {item}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </SprintCard>
    );
}
