import PageHeader from "@/components/sprint/common/PageHeader";
import SprintNavigation from "@/components/sprint/common/SprintNavigation";
import ProjectsSection from "@/components/sprint/projects/ProjectsSection";

export default function Projects() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Projects"
                description="Manage your AI software projects and sprint planning."
                actionLabel="New Project"
            />

            <SprintNavigation />

            <ProjectsSection />
        </div>
    );
}