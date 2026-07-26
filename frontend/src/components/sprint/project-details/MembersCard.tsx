import { useState } from "react";
import { Users } from "lucide-react";

import AddMemberDialog from "./AddMemberDialog";

import { useMembers } from "@/hooks/useMembers";

import type { Project } from "@/services/project/types";

type MembersCardProps = {
    project: Project;
};

export default function MembersCard({
    project,
}: MembersCardProps) {
    const {
        members,
        loading,
        createMember,
    } = useMembers(project.id);

    const [isDialogOpen, setIsDialogOpen] =
        useState(false);

    async function handleCreateMember(data: {
        name: string;
        role: string;
        skill: string;
        availability: number;
    }) {
        await createMember(data);
    }

    return (
        <section className="rounded-xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--app-strong)]">
                    Team Members
                </h3>

                <button
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                    className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-[var(--app-surface)] transition hover:bg-cyan-400"
                >
                    + Add Member
                </button>
            </div>

            {loading ? (
                <p className="mt-6 text-[var(--app-text-muted)]">
                    Loading members...
                </p>
            ) : members.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-dashed border-[var(--app-border)] py-10 text-center">
                    <Users className="h-10 w-10 text-[var(--app-text-muted)]" />

                    <h4 className="mt-4 text-lg font-medium text-[var(--app-strong)]">
                        No Team Members
                    </h4>

                    <p className="mt-2 max-w-sm text-sm text-[var(--app-text-muted)]">
                        Add your project members to help SprintWise generate
                        balanced sprint assignments.
                    </p>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="rounded-lg border-[var(--app-border)] bg-[var(--app-surface)] p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-[var(--app-strong)]">
                                        {member.name}
                                    </h4>

                                    <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                                        {member.role}
                                    </p>
                                </div>

                                <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                                    {member.availability}%
                                </span>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--app-text-muted)]">
                                <span>Skill:</span>

                                <span className="rounded-md bg-[var(--app-surface-secondary)] px-2 py-1 text-[var(--app-text-muted)]">
                                    {member.skill}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddMemberDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleCreateMember}
            />
        </section>
    );
}