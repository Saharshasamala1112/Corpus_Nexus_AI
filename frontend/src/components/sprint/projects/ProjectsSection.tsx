import ProjectFilters from "./ProjectFilters";
import ProjectGrid from "./ProjectGrid";

import { cn } from "@/lib/utils";

type ProjectsSectionProps = {
    className?: string;
};

export default function ProjectsSection({ className }: ProjectsSectionProps) {
    return (
        <section className={cn("flex w-full flex-col gap-6", className)}>
            <ProjectFilters />
            <ProjectGrid />
        </section>
    );
}
