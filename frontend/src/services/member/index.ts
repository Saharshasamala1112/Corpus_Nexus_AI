import { api } from "@/api/client";

import type {
    CreateTeamMemberInput,
    TeamMember,
    UpdateTeamMemberInput,
} from "./types";

export async function getMembers(
    projectId: string,
): Promise<TeamMember[]> {
    return api.get<TeamMember[]>(
        `/projects/${projectId}/members`,
    );
}

export async function createMember(
    projectId: string,
    data: CreateTeamMemberInput,
): Promise<TeamMember> {
    return api.post<TeamMember>(
        `/projects/${projectId}/members`,
        data,
    );
}

export async function updateMember(
    memberId: string,
    data: UpdateTeamMemberInput,
): Promise<TeamMember> {
    return api.put<TeamMember>(
        `/members/${memberId}`,
        data,
    );
}

export async function deleteMember(
    memberId: string,
): Promise<void> {
    await api.delete(`/members/${memberId}`);
}