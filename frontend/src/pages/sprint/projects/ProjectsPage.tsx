import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getProjects,
    saveProject,
    updateProject,
    deleteProject,
} from "../../../services/sprint/projectService";

import type { Project } from "../../../types/sprint/project";

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sprintDuration, setSprintDuration] = useState(2);
    const [teamSize, setTeamSize] = useState(4);

    useEffect(() => {
        let isMounted = true;

        async function fetchProjects() {
            try {
                const data = await getProjects();

                if (isMounted) {
                    setProjects(Array.isArray(data) ? data : []);
                }
            } catch {
                if (isMounted) {
                    setProjects([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void fetchProjects();

        return () => {
            isMounted = false;
        };
    }, []);

    async function loadProjects() {
        try {
            const data = await getProjects();
            setProjects(Array.isArray(data) ? data : []);
        } catch {
            setProjects([]);
        }
    }

    function resetForm() {
        setEditingProject(null);
        setName("");
        setDescription("");
        setSprintDuration(2);
        setTeamSize(4);
    }

    async function handleSubmit() {
        if (!name.trim()) {
            alert("Project name is required");
            return;
        }

        try {
            if (editingProject) {
                await updateProject({
                    ...editingProject,
                    name,
                    description,
                    sprintDuration,
                    teamSize,
                });
            } else {
                await saveProject({
                    id: "",
                    name,
                    description,
                    sprintDuration,
                    teamSize,
                    members: [],
                    createdAt: "",
                });
            }

            await loadProjects();
            resetForm();
        } catch {
            alert(
                editingProject ? "Failed to update project" : "Failed to create project"
            );
        }
    }

    function handleEdit(project: Project) {
        setEditingProject(project);
        setName(project.name);
        setDescription(project.description);
        setSprintDuration(project.sprintDuration);
        setTeamSize(project.teamSize);
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProject(id);

            if (editingProject?.id === id) {
                resetForm();
            }

            await loadProjects();
        } catch {
            alert("Failed to delete project");
        }
    }

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold">Projects</h1>

            <div className="mt-8 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-6 text-2xl font-semibold">
                    {editingProject ? "Edit Project" : "Create Project"}
                </h2>

                <div className="space-y-4">
                    <input
                        className="w-full rounded border p-3"
                        placeholder="Project Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <textarea
                        className="w-full rounded border p-3"
                        rows={4}
                        placeholder="Project Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            className="rounded border p-3"
                            value={sprintDuration}
                            onChange={(e) => setSprintDuration(Number(e.target.value))}
                        />

                        <input
                            type="number"
                            className="rounded border p-3"
                            value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmit}
                            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                        >
                            {editingProject ? "Update Project" : "Create Project"}
                        </button>

                        {editingProject && (
                            <button
                                onClick={resetForm}
                                className="rounded-lg bg-gray-500 px-6 py-3 text-white hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="mb-5 text-2xl font-semibold">My Projects</h2>

                {projects.length === 0 ? (
                    <p className="text-gray-500">No projects created yet.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {projects.map((project) => (
                            <div key={project.id} className="rounded-xl bg-white p-6 shadow">
                                <h3 className="text-xl font-bold">{project.name}</h3>

                                <p className="mt-3 text-gray-600">{project.description}</p>

                                <div className="mt-4 space-y-1 text-sm text-gray-500">
                                    <p>Sprint Duration: {project.sprintDuration} weeks</p>
                                    <p>Team Size: {project.teamSize}</p>
                                    <p>Members: {project.members?.length ?? 0}</p>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                    >
                                        View
                                    </Link>

                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="rounded-lg bg-yellow-500 px-5 py-2 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
