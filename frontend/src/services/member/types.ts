export interface TeamMember {
    id: string;
    projectId: string;
    name: string;
    role: string;
    skill: string;
    availability: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTeamMemberInput {
    name: string;
    role: string;
    skill: string;
    availability: number;
}

export interface UpdateTeamMemberInput {
    name?: string;
    role?: string;
    skill?: string;
    availability?: number;
}