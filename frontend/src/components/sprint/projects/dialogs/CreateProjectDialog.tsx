import { useState } from "react";

import { Button } from "@/components/ui/button";

type CreateProjectDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (data: {
        name: string;
        description: string;
        sprintDuration: number;
        teamSize: number;
    }) => void;
};

export default function CreateProjectDialog({
    open,
    onClose,
    onCreate,
}: CreateProjectDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sprintDuration, setSprintDuration] = useState(14);
    const [teamSize, setTeamSize] = useState(4);

    if (!open) return null;

    function handleCreate() {
        if (!name.trim()) {
            return;
        }

        onCreate({
            name: name.trim(),
            description: description.trim(),
            sprintDuration,
            teamSize,
        });

        setName("");
        setDescription("");
        setSprintDuration(14);
        setTeamSize(4);

        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white">
                    Create Project
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Create a new SprintWise project.
                </p>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Project Name
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Sprint Duration
                            </label>

                            <input
                                type="number"
                                min={1}
                                max={30}
                                value={sprintDuration}
                                onChange={(e) =>
                                    setSprintDuration(Number(e.target.value))
                                }
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Team Size
                            </label>

                            <input
                                type="number"
                                min={1}
                                value={teamSize}
                                onChange={(e) =>
                                    setTeamSize(Number(e.target.value))
                                }
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button onClick={handleCreate}>
                        Create Project
                    </Button>
                </div>
            </div>
        </div>
    );
}