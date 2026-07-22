import type { SprintData } from "../../components/sprint/dashboard/SprintDashboard";

function extractSection(markdown: string, heading: string): string {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(
        `##?\\s*${escapedHeading}\\s*([\\s\\S]*?)(?=\\n##?\\s|$)`,
        "i"
    );

    const match = markdown.match(regex);

    return match?.[1]?.trim() ?? "";
}

function extractList(section: string): string[] {
    return section
        .split("\n")
        .map((line) =>
            line
                .replace(/^[-*]\s*/, "")
                .replace(/^\d+\.\s*/, "")
                .trim()
        )
        .filter(Boolean);
}

export function parseSprintMarkdown(markdown: string): SprintData {
    const goal = extractSection(markdown, "Sprint Goal");

    const tasks = extractList(
        extractSection(markdown, "Tasks") ||
        extractSection(markdown, "User Stories")
    );

    const timeline = extractList(extractSection(markdown, "Timeline"));

    const risks = extractList(extractSection(markdown, "Risks"));

    const acceptanceCriteria = extractList(
        extractSection(markdown, "Acceptance Criteria")
    );

    return {
        goal,
        tasks,
        timeline,
        risks,
        acceptanceCriteria,
    };
}
