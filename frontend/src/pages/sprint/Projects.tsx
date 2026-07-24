import { useEffect, useState } from "react";

import PageHeader from "@/components/sprint/common/PageHeader";
import SprintNavigation from "@/components/sprint/common/SprintNavigation";
import ProjectsSection from "@/components/sprint/projects/ProjectsSection";
import CreateProjectDialog from "@/components/sprint/projects/dialogs/CreateProjectDialog";

import { createProject, getProjects } from "@/services/project";
import type { Project } from "@/services/project/types";

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        refreshProjects();
    }, []);

    function refreshProjects() {
        setProjects(getProjects());
    }

    function handleCreateProject(data: {
        name: string;
        description: string;
        sprintDuration: number;
        teamSize: number;
    }) {
        createProject({
            name: data.name,
            description: data.description,
            sprintDuration: data.sprintDuration,
            teamSize: data.teamSize,

            status: "Planning",

            members: [],

            generatedSprint: undefined,
        });

        refreshProjects();

        setIsCreateDialogOpen(false);
    }

    return (
        <>
            <div className="space-y-8">
                <PageHeader
                    title="Projects"
                    description="Manage your AI software projects and sprint planning."
                    actionLabel="New Project"
                    onAction={() => setIsCreateDialogOpen(true)}
                />

                <SprintNavigation />

                <ProjectsSection
                    projects={projects}
                    setProjects={setProjects}
                />
            </div>

            <CreateProjectDialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onCreate={handleCreateProject}
            />
        </>
    );
}