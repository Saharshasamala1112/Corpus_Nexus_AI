import { useState } from "react";
import type { TeamMember } from "../../../types/sprint/project";

interface MemberFormProps {
    onAddMember: (member: TeamMember) => void;
    editingMember?: TeamMember | null;
    onCancelEdit?: () => void;
}

export default function MemberForm({
    onAddMember,
    editingMember,
    onCancelEdit,
}: MemberFormProps) {
    const [name, setName] = useState(editingMember?.name ?? "");
    const [role, setRole] = useState(editingMember?.role ?? "");
    const [skill, setSkill] = useState(editingMember?.skill ?? "");
    const [availability, setAvailability] = useState(
        editingMember?.availability ?? 40
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) return;

        onAddMember({
            id: editingMember?.id ?? crypto.randomUUID(),
            name,
            role,
            skill,
            availability,
        });

        if (!editingMember) {
            setName("");
            setRole("");
            setSkill("");
            setAvailability(40);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                className="w-full rounded border p-3"
                placeholder="Member Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                className="w-full rounded border p-3"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />

            <input
                className="w-full rounded border p-3"
                placeholder="Primary Skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
            />

            <input
                type="number"
                className="w-full rounded border p-3"
                placeholder="Availability (hours/week)"
                value={availability}
                onChange={(e) => setAvailability(Number(e.target.value))}
            />

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
                >
                    {editingMember ? "Update Member" : "Add Member"}
                </button>

                {editingMember && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="rounded-lg bg-gray-500 px-5 py-3 text-white hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
