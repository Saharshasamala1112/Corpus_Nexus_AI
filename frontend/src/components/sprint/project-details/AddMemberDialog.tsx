import { useState } from "react";

import type { CreateTeamMemberInput } from "@/services/member/types";

type AddMemberDialogProps = {
    open: boolean;
    onClose: () => void;
    onSave: (data: CreateTeamMemberInput) => Promise<void>;
};

export default function AddMemberDialog({
    open,
    onClose,
    onSave,
}: AddMemberDialogProps) {
    const [form, setForm] = useState<CreateTeamMemberInput>({
        name: "",
        role: "",
        skill: "",
        availability: 100,
    });

    if (!open) return null;

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();

        await onSave(form);

        setForm({
            name: "",
            role: "",
            skill: "",
            availability: 100,
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--app-surface)]/60">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-xl bg-[var(--app-surface)] p-6"
            >
                <h2 className="text-xl font-semibold text-[var(--app-strong)]">
                    Add Team Member
                </h2>

                <div className="mt-6 space-y-4">
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                        className="w-full rounded-lg border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-3 text-[var(--app-text)] outline-none focus:border-violet-500"
                        required
                    />

                    <input
                        placeholder="Role"
                        value={form.role}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                role: e.target.value,
                            })
                        }
                        className="w-full rounded-lg border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-3 text-[var(--app-text)] outline-none focus:border-violet-500"
                        required
                    />

                    <input
                        placeholder="Skill"
                        value={form.skill}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                skill: e.target.value,
                            })
                        }
                        className="w-full rounded-lg border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-3 text-[var(--app-text)] outline-none focus:border-violet-500"
                        required
                    />

                    <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Availability"
                        value={form.availability}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                availability: Number(e.target.value),
                            })
                        }
                        className="w-full rounded-lg border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-3 text-[var(--app-text)] outline-none focus:border-violet-500"
                        required
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border-[var(--app-border)] px-4 py-2 text-[var(--app-text)] transition hover:text-[var(--app-strong)]"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-[var(--app-surface)]"
                    >
                        Save Member
                    </button>
                </div>
            </form>
        </div>
    );
}