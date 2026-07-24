import PageHeader from "@/components/sprint/common/PageHeader";
import SprintNavigation from "@/components/sprint/common/SprintNavigation";
import GeneratorSection from "@/components/sprint/generator/GeneratorSection";

export default function SprintGenerator() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Sprint Generator"
                description="Generate AI-powered sprint plans for your software projects."
                actionLabel="Generate Sprint"
            />

            <SprintNavigation />

            <GeneratorSection />
        </div>
    );
}