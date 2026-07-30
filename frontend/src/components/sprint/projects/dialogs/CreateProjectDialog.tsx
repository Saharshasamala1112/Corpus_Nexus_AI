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
            <div className="w-full max-w-lg rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--shadow-lg)]">
                <h2 className="text-xl font-semibold text-[var(--app-strong)]">
                    {mode === "edit"
                        ? "Edit Project"
                        : "Create Project"}
                </h2>

                <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                    {mode === "edit"
                        ? "Update your SprintWise project."
                        : "Create a new SprintWise project."}
                </p>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-[var(--app-text-muted)]">
                            Project Name
                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter project name"
                            className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-soft)] transition-colors focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent-soft)]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-[var(--app-text-muted)]">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Add a short project description"
                            className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-soft)] transition-colors focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent-soft)]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm text-[var(--app-text-muted)]">
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
                                className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-[var(--app-text)] outline-none transition-colors focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent-soft)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--app-text-muted)]">
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
                                className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2 text-[var(--app-text)] outline-none transition-colors focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent-soft)]"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:bg-[var(--app-surface-secondary)]"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        className="bg-[var(--app-accent)] text-[var(--app-surface)] hover:bg-[var(--app-accent)]/90"
                    >
                        {mode === "edit"
                            ? "Save Changes"
                            : "Create Project"}
                    </Button>
                </div>
            </div>
        </div>
    );
}