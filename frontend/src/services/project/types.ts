import type { SprintResult } from "../sprintGenerator/types";

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    skill: string;
    availability: number;
}

export type ProjectStatus =
    | "Planning"
    | "Active"
    | "Completed";

export interface Project {
    id: string;

    name: string;
    description: string;

    // Stored as working days
    sprintDuration: number;
    teamSize: number;

    status: ProjectStatus;

    members?: TeamMember[];

    generatedSprint?: SprintResult;

    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectInput {
    name: string;
    description: string;
    sprintDuration: number;
    teamSize: number;
    status: ProjectStatus;
}

export interface UpdateProjectInput {
    name: string;
    description: string;
    sprintDuration: number;
    teamSize: number;
    status: ProjectStatus;
}