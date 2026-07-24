import { useState } from "react";

import SprintPromptForm from "./SprintPromptForm";
import SprintPreview from "./SprintPreview";
import TaskBreakdown from "./TaskBreakdown";

import type { SprintResult } from "@/services/sprintGenerator/types";

import { cn } from "@/lib/utils";

type GeneratorSectionProps = {
    className?: string;
};

export default function GeneratorSection({
    className,
}: GeneratorSectionProps) {
    const [sprint, setSprint] = useState<SprintResult | null>(null);

    return (
        <section className={cn("flex flex-col gap-6", className)}>
            <SprintPromptForm onGenerate={setSprint} />

            <SprintPreview sprint={sprint} />

            <TaskBreakdown sprint={sprint} />
        </section>
    );
}