import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import MemberForm from "../../../components/sprint/projects/MemberForm";
import SprintDashboard from "../../../components/sprint/dashboard/SprintDashboard";

import {
    generateSprint,
    getProject,
    updateProject,
} from "../../../services/sprint/projectService";

import type { Project, TeamMember } from "../../../types/sprint/project";
import { parseSprintMarkdown } from "../../../utils/sprint/sprintParser";

export default function ProjectDetails() {
    const { id } = useParams();
    const location = useLocation();

    const [project, setProject] = useState<Project | null>(null);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const [sprintPlan, setSprintPlan] = useState(
        (location.state as { sprint?: string } | null)?.sprint ?? ""
    );

    const parsedSprint = sprintPlan ? parseSprintMarkdown(sprintPlan) : null;

    useEffect(() => {
        let mounted = true;

        async function fetchProject() {
            if (!id) {
                if (mounted) setLoading(false);
                return;
            }

            try {
                const data = await getProject(id);

                if (!mounted) return;

                setProject(data);

                if (data.generatedSprint) {
                    setSprintPlan(data.generatedSprint);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        void fetchProject();

        return () => {
            mounted = false;
        };
    }, [id]);

    async function reloadProject() {
        if (!id) return;

        const data = await getProject(id);

        setProject(data);

        if (data.generatedSprint) {
            setSprintPlan(data.generatedSprint);
        }
    }

    async function handleAddMember(member: TeamMember) {
        if (!project) return;

        const updatedMembers = editingMember
            ? project.members.map((m) => (m.id === editingMember.id ? member : m))
            : [...project.members, member];

        const updatedProject: Project = {
            ...project,
            members: updatedMembers,
        };

        try {
            const savedProject = await updateProject(updatedProject);

            setProject(savedProject);
            setEditingMember(null);
        } catch {
            alert("Failed to save member.");
        }
    }

    function handleEditMember(member: TeamMember) {
        setEditingMember(member);
    }

    async function handleDeleteMember(memberId: string) {
        if (!project) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this team member?"
        );

        if (!confirmed) return;

        const updatedProject: Project = {
            ...project,
            members: project.members.filter((m) => m.id !== memberId),
        };

        try {
            const savedProject = await updateProject(updatedProject);

            setProject(savedProject);

            if (editingMember?.id === memberId) {
                setEditingMember(null);
            }
        } catch {
            alert("Failed to delete member.");
        }
    }

    async function handleGenerateSprint() {
        if (!project) return;

        try {
            setGenerating(true);

            const response = await generateSprint(project.id);

            if (!response?.sprint) {
                throw new Error("No sprint generated");
            }

            setSprintPlan(response.sprint);

            await reloadProject();
        } catch {
            alert("Failed to generate sprint.");
        } finally {
            setGenerating(false);
        }
    }

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (!project) {
        return <h1 className="text-3xl font-bold">Project Not Found</h1>;
    }

    return (
        <div className="space-y-8">
            <div className="rounded-xl bg-white p-8 shadow">
                <h1 className="text-4xl font-bold">{project.name}</h1>

                <p className="mt-4 text-gray-600">{project.description}</p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-slate-100 p-4">
                        <h3 className="text-gray-500">Sprint Duration</h3>

                        <p className="text-2xl font-bold">{project.sprintDuration} Weeks</p>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-4">
                        <h3 className="text-gray-500">Team Size</h3>

                        <p className="text-2xl font-bold">{project.teamSize}</p>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-4">
                        <h3 className="text-gray-500">Members</h3>

                        <p className="text-2xl font-bold">{project.members.length}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl bg-white p-8 shadow">
                <h2 className="mb-6 text-2xl font-bold">
                    {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h2>

                <MemberForm
                    key={editingMember?.id ?? "new-member"}
                    onAddMember={handleAddMember}
                    editingMember={editingMember}
                    onCancelEdit={() => setEditingMember(null)}
                />
            </div>

            <div className="rounded-xl bg-white p-8 shadow">
                <h2 className="mb-6 text-2xl font-bold">Team Members</h2>

                {project.members.length === 0 ? (
                    <p>No members added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {project.members.map((member) => (
                            <div key={member.id} className="rounded-lg border p-4">
                                <h3 className="font-bold">{member.name}</h3>

                                <p>{member.role}</p>

                                <p>{member.skill}</p>

                                <p>{member.availability} hrs/week</p>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => handleEditMember(member)}
                                        className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDeleteMember(member.id)}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-xl bg-white p-8 shadow">
                <button
                    onClick={handleGenerateSprint}
                    disabled={generating}
                    className="rounded-lg bg-purple-600 px-6 py-3 text-white transition hover:bg-purple-700 disabled:bg-gray-400"
                >
                    {generating
                        ? "Generating Sprint..."
                        : project.generatedSprint
                            ? "Regenerate Sprint"
                            : "Generate Sprint"}
                </button>
            </div>

            {parsedSprint && (
                <div className="rounded-xl bg-white p-8 shadow">
                    <h2 className="mb-6 text-2xl font-bold">Sprint Dashboard</h2>

                    <SprintDashboard sprint={parsedSprint} />
                </div>
            )}
        </div>
    );
}
