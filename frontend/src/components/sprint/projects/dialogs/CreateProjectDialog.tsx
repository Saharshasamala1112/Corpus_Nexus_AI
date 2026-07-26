import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import type { Project } from "@/services/project/types";

type CreateProjectDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (data: {
        name: string;
        description: string;
        sprintDuration: number;
        teamSize: number;
    }) => void;
    project?: Project;
    mode?: "create" | "edit";
};

export default function CreateProjectDialog({
    open,
    onClose,
    onCreate,
    project,
    mode = "create",
}: CreateProjectDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sprintDuration, setSprintDuration] = useState(14);
    const [teamSize, setTeamSize] = useState(4);

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description);
            setSprintDuration(project.sprintDuration);
            setTeamSize(project.teamSize);
        } else {
            setName("");
            setDescription("");
            setSprintDuration(14);
            setTeamSize(4);
        }
    }, [project, open]);

    if (!open) return null;

    function handleSubmit() {
        if (!name.trim()) return;

        onCreate({
            name: name.trim(),
            description: description.trim(),
            sprintDuration,
            teamSize,
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--app-overlay)] p-4">
            <div className="w-full max-w-lg rounded-2xl border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-[color:var(--app-text)]">
                    {mode === "edit"
                        ? "Edit Project"
                        : "Create Project"}
                </h2>

                <p className="mt-1 text-sm text-[color:var(--app-text-muted)]">
                    {mode === "edit"
                        ? "Update your SprintWise project."
                        : "Create a new SprintWise project."}
                </p>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-[color:var(--app-text-muted)]">
                            Project Name
                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface-muted)] px-3 py-2 text-[color:var(--app-text)] outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-[color:var(--app-text-muted)]">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="w-full rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface-muted)] px-3 py-2 text-[color:var(--app-text)] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm text-[color:var(--app-text-muted)]">
                                Sprint Duration (Days)
                            </label>

                            <input
                                type="number"
                                min={1}
                                max={30}
                                value={sprintDuration}
                                onChange={(e) =>
                                    setSprintDuration(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface-muted)] px-3 py-2 text-[color:var(--app-text)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[color:var(--app-text-muted)]">
                                Team Size
                            </label>

                            <input
                                type="number"
                                min={1}
                                value={teamSize}
                                onChange={(e) =>
                                    setTeamSize(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface-muted)] px-3 py-2 text-[color:var(--app-text)] outline-none"
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

                    <Button onClick={handleSubmit}>
                        {mode === "edit"
                            ? "Save Changes"
                            : "Create Project"}
                    </Button>
                </div>
            </div>
        </div>
    );
}