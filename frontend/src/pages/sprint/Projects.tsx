import { useState } from "react";

import PageHeader from "@/components/sprint/common/PageHeader";
import SprintNavigation from "@/components/sprint/common/SprintNavigation";
import ProjectsSection from "@/components/sprint/projects/ProjectsSection";
import CreateProjectDialog from "@/components/sprint/projects/dialogs/CreateProjectDialog";

import { useProjects } from "@/hooks/useProjects";

import type { Project } from "@/services/project/types";

export default function Projects() {
    const {
        projects,
        createProject,
        updateProject,
        deleteProject,
    } = useProjects();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    async function handleSubmit(data: {
        name: string;
        description: string;
        sprintDuration: number;
        teamSize: number;
    }) {
        try {
            if (editingProject) {
                await updateProject(editingProject.id, {
                    name: data.name,
                    description: data.description,
                    sprintDuration: data.sprintDuration,
                    teamSize: data.teamSize,
                    status: editingProject.status,
                });
            } else {
                await createProject({
                    name: data.name,
                    description: data.description,
                    sprintDuration: data.sprintDuration,
                    teamSize: data.teamSize,
                    status: "Planning",
                });
            }

            setEditingProject(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save project:", error);
        }
    }

    function handleCreate() {
        setEditingProject(null);
        setIsDialogOpen(true);
    }

    function handleEdit(project: Project) {
        setEditingProject(project);
        setIsDialogOpen(true);
    }

    async function handleDelete(project: Project) {
        const confirmed = window.confirm(
            `Delete "${project.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProject(project.id);
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    }

    return (
        <>
            <div className="space-y-8">
                <PageHeader
                    title="Projects"
                    description="Manage your AI software projects and sprint planning."
                    actionLabel="New Project"
                    onAction={handleCreate}
                />

                <SprintNavigation />

                <ProjectsSection
                    projects={projects}
                    onEditProject={handleEdit}
                    onDeleteProject={handleDelete}
                />
            </div>

            <CreateProjectDialog
                open={isDialogOpen}
                onClose={() => {
                    setEditingProject(null);
                    setIsDialogOpen(false);
                }}
                onCreate={handleSubmit}
                project={editingProject ?? undefined}
                mode={
                    editingProject
                        ? "edit"
                        : "create"
                }
            />
        </>
    );
}