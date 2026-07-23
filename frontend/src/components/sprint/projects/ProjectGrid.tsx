import ProjectCard from "./ProjectCard";

import { cn } from "@/lib/utils";

type ProjectGridProps = {
    className?: string;
};

type ProjectItem = {
    name: string;
    description: string;
    status: "Active" | "Planning" | "Completed";
    members: number;
    tasks: number;
    lastUpdated: string;
};

const projects: ProjectItem[] = [
    {
        name: "Project Atlas",
        description: "AI-assisted planning and delivery coordination.",
        status: "Active",
        members: 8,
        tasks: 24,
        lastUpdated: "2h ago",
    },
    {
        name: "Sprint Forge",
        description: "Create sprint workflows with intelligent sequencing.",
        status: "Planning",
        members: 5,
        tasks: 13,
        lastUpdated: "5h ago",
    },
    {
        name: "Launch Pulse",
        description: "Track readiness, dependencies, and launch milestones.",
        status: "Completed",
        members: 6,
        tasks: 31,
        lastUpdated: "1d ago",
    },
    {
        name: "Insight Loop",
        description: "Surface retrospectives and continuous improvement insights.",
        status: "Active",
        members: 4,
        tasks: 17,
        lastUpdated: "2d ago",
    },
    {
        name: "Velocity Lab",
        description: "Monitor throughput and sprint health with AI forecasting.",
        status: "Planning",
        members: 7,
        tasks: 22,
        lastUpdated: "3d ago",
    },
    {
        name: "Ops Navigator",
        description: "Coordinate team execution across multi-step initiatives.",
        status: "Completed",
        members: 9,
        tasks: 29,
        lastUpdated: "4d ago",
    },
];

export default function ProjectGrid({ className }: ProjectGridProps) {
    return (
        <section className={cn("w-full", className)}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.name}
                        name={project.name}
                        description={project.description}
                        status={project.status}
                        members={project.members}
                        tasks={project.tasks}
                        lastUpdated={project.lastUpdated}
                    />
                ))}
            </div>
        </section>
    );
}
