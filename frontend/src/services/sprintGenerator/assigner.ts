import type { TeamMember } from "./types";

const SKILL_TASK_MAP: Record<string, string> = {
    react: "Frontend Development",
    typescript: "Frontend Development",
    javascript: "Frontend Development",
    html: "Frontend Development",
    css: "Frontend Development",

    python: "Backend API Development",
    fastapi: "Backend API Development",
    django: "Backend API Development",
    flask: "Backend API Development",
    java: "Backend API Development",
    spring: "Backend API Development",
    node: "Backend API Development",
    express: "Backend API Development",

    sql: "Database Design",
    mysql: "Database Design",
    postgresql: "Database Design",
    postgres: "Database Design",
    mongodb: "Database Design",
    database: "Database Design",

    testing: "Testing & Bug Fixes",
    qa: "Testing & Bug Fixes",
    selenium: "Testing & Bug Fixes",

    docker: "Deployment",
    devops: "Deployment",
    aws: "Deployment",
    azure: "Deployment",
};

const DEFAULT_TASK = "Requirement Analysis";

export function assignTasks(members: TeamMember[]): string[] {
    if (!members || members.length === 0) {
        return [
            "Requirement Analysis → Team Member 1",
            "Backend API Development → Team Member 2",
            "Frontend Development → Team Member 3",
            "Testing & Bug Fixes → Team Member 4",
        ];
    }

    const assignments: string[] = [];
    const assignedTasks = new Set<string>();

    members.forEach((member) => {
        const name = member.name || "Unknown Member";
        const skill = (member.skill || member.role || "").toLowerCase();

        let task = DEFAULT_TASK;

        for (const [keyword, mappedTask] of Object.entries(SKILL_TASK_MAP)) {
            if (skill.includes(keyword)) {
                task = mappedTask;
                break;
            }
        }

        if (assignedTasks.has(task)) {
            task = `Support ${task}`;
        }

        assignedTasks.add(task);

        assignments.push(`${task} → ${name}`);
    });

    return assignments;
}