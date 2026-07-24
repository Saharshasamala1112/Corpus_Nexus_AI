import { PROJECT_TEMPLATES } from "./templates";
import { assignTasks } from "./assigner";
import { generateTimeline } from "./timeline";
import {
    generateAcceptanceCriteria,
    generateRisks,
} from "./risks";

import type { Project, SprintResult } from "./types";

function detectProjectType(project: Project): string {
    const text = `${project.name} ${project.description}`.toLowerCase();

    const keywords: Record<string, string[]> = {
        ai: [
            "ai",
            "artificial intelligence",
            "machine learning",
            "ml",
            "nlp",
            "chatbot",
        ],

        health: [
            "hospital",
            "health",
            "medical",
            "patient",
            "clinic",
        ],

        education: [
            "education",
            "student",
            "learning",
            "school",
            "college",
            "course",
        ],

        ecommerce: [
            "ecommerce",
            "shopping",
            "cart",
            "payment",
            "product",
            "order",
            "store",
        ],

        chat: [
            "chat",
            "message",
            "messaging",
            "notification",
            "social",
        ],

        management: [
            "management",
            "project",
            "inventory",
            "employee",
            "crm",
            "erp",
        ],
    };

    for (const [type, words] of Object.entries(keywords)) {
        if (words.some((word) => text.includes(word))) {
            return type;
        }
    }

    return "default";
}

function buildMarkdown(
    goal: string,
    stories: string[],
    tasks: string[],
    assignments: string[],
    timeline: string[],
    risks: string[],
    acceptance: string[]
): string {
    let sprint = `# Sprint Goal\n\n${goal}\n\n`;

    sprint += "## User Stories\n\n";
    stories.forEach((story) => {
        sprint += `- ${story}\n`;
    });

    sprint += "\n## Tasks\n\n";
    tasks.forEach((task) => {
        sprint += `- ${task}\n`;
    });

    sprint += "\n## Task Assignment\n\n";
    assignments.forEach((assignment) => {
        sprint += `- ${assignment}\n`;
    });

    sprint += "\n## Timeline\n\n";
    timeline.forEach((item) => {
        sprint += `- ${item}\n`;
    });

    sprint += "\n## Risks\n\n";
    risks.forEach((risk) => {
        sprint += `- ${risk}\n`;
    });

    sprint += "\n## Acceptance Criteria\n\n";
    acceptance.forEach((item) => {
        sprint += `- ${item}\n`;
    });

    return sprint;
}

export function generateSprint(project: Project): SprintResult {
    const projectType = detectProjectType(project);

    const template =
        PROJECT_TEMPLATES[projectType] ??
        PROJECT_TEMPLATES.default;

    const assignments = assignTasks(project.members);

    const timeline = generateTimeline(project.sprintDuration);

    const risks = generateRisks(projectType);

    const acceptance = generateAcceptanceCriteria(projectType);

    const markdown = buildMarkdown(
        template.goal,
        template.stories,
        template.tasks,
        assignments,
        timeline,
        risks,
        acceptance
    );

    return {
        markdown,
        goal: template.goal,
        stories: template.stories,
        tasks: template.tasks,
        assignments,
        timeline,
        risks,
        acceptance,
    };
}