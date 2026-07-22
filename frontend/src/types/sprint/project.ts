export interface TeamMember {
    id: string;
    name: string;
    role: string;
    skill: string;
    availability: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;

    sprintDuration: number;
    teamSize: number;

    members: TeamMember[];

    generatedSprint?: string;

    createdAt?: string;
    updatedAt?: string;
}
