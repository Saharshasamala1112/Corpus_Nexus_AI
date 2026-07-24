export interface TeamMember {
    id: string;
    name: string;
    email?: string;
    role?: string;
    skill?: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    sprintDuration: number;
    members: TeamMember[];
}

export interface SprintTemplate {
    goal: string;
    stories: string[];
    tasks: string[];
}

export interface SprintResult {
    markdown: string;
    goal: string;
    stories: string[];
    tasks: string[];
    assignments: string[];
    timeline: string[];
    risks: string[];
    acceptance: string[];
}