import SprintCard from "./SprintCard";

interface SprintTasksProps {
    tasks: string[];
}

export default function SprintTasks({ tasks }: SprintTasksProps) {
    return (
        <SprintCard title="Sprint Tasks">
            <div className="space-y-4">
                {tasks.map((task, index) => (
                    <div
                        key={`${index}-${task}`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                {index + 1}
                            </div>

                            <div>
                                <p className="font-medium text-slate-800">{task}</p>

                                <p className="text-sm text-slate-500">Sprint Task</p>
                            </div>
                        </div>

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            To Do
                        </span>
                    </div>
                ))}
            </div>
        </SprintCard>
    );
}
