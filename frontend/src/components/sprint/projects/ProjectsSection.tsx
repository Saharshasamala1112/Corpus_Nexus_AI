import { useMemo, useState } from "react";

import ProjectFilters from "./ProjectFilters";
import ProjectGrid from "./ProjectGrid";

import type { Project } from "@/services/project/types";

import { cn } from "@/lib/utils";

type ProjectsSectionProps = {
    className?: string;
    projects: Project[];
    onEditProject: (project: Project) => void;
    onDeleteProject: (project: Project) => void;
};

export default function ProjectsSection({
    className,
    projects,
    onEditProject,
    onDeleteProject,
}: ProjectsSectionProps) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                project.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                project.description
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                status === "All" ||
                project.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [projects, search, status]);

    return (
        <section className={cn("flex flex-col gap-6", className)}>
            <ProjectFilters
                search={search}
                status={status}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
            />

            <ProjectGrid
                projects={filteredProjects}
                onEditProject={onEditProject}
                onDeleteProject={onDeleteProject}
            />
        </section>
    );
}