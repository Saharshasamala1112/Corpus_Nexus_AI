import { useEffect, useState } from "react";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "@/components/sprint/common/PageHeader";
import SprintNavigation from "@/components/sprint/common/SprintNavigation";

import MembersCard from "@/components/sprint/project-details/MembersCard";
import ProjectOverviewCard from "@/components/sprint/project-details/ProjectOverviewCard";
import SprintCard from "@/components/sprint/project-details/SprintCard";

import { getProject } from "@/services/project";
import type { Project } from "@/services/project/types";

export default function ProjectDetails() {
    const { projectId } = useParams<{
        projectId: string;
    }>();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProject() {
            if (!projectId) {
                setLoading(false);
                return;
            }

            try {
                const data = await getProject(projectId);
                setProject(data);
            } catch (error) {
                console.error("Failed to load project:", error);
                setProject(null);
            } finally {
                setLoading(false);
            }
        }

        loadProject();
    }, [projectId]);

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Loading..."
                    description="Loading project details..."
                />
                <SprintNavigation />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Project Details"
                    description="View and manage your SprintWise AI project."
                />

                <SprintNavigation />

                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/70 p-12 text-center">
                    <FolderKanban className="mx-auto h-12 w-12 text-slate-500" />

                    <h2 className="mt-4 text-xl font-semibold text-white">
                        Project not found
                    </h2>

                    <p className="mt-2 text-slate-400">
                        The requested project doesn't exist or may have been
                        deleted.
                    </p>

                    <Link
                        to="/sprintwise-ai/projects"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title={project.name}
                description="Project overview and sprint information."
            />

            <SprintNavigation />

            <Link
                to="/sprintwise-ai/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
            </Link>

            <ProjectOverviewCard project={project} />

            <div className="grid gap-6 lg:grid-cols-2">
                <MembersCard project={project} />
                <SprintCard project={project} />
            </div>
        </div>
    );
}