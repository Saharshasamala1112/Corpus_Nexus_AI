import { useCallback, useEffect, useState } from "react";

import {
    createMember as createMemberApi,
    deleteMember as deleteMemberApi,
    getMembers,
    updateMember as updateMemberApi,
} from "@/services/member";

import type {
    CreateTeamMemberInput,
    TeamMember,
    UpdateTeamMemberInput,
} from "@/services/member/types";

export function useMembers(projectId: string) {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshMembers = useCallback(async () => {
        if (!projectId) {
            setMembers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const data = await getMembers(projectId);

            setMembers(data);
        } catch (error) {
            console.error("Failed to load members:", error);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void refreshMembers();
    }, [refreshMembers]);

    async function createMember(
        data: CreateTeamMemberInput,
    ) {
        await createMemberApi(projectId, data);

        await refreshMembers();
    }

    async function updateMember(
        memberId: string,
        data: UpdateTeamMemberInput,
    ) {
        await updateMemberApi(memberId, data);

        await refreshMembers();
    }

    async function deleteMember(memberId: string) {
        await deleteMemberApi(memberId);

        await refreshMembers();
    }

    return {
        loading,
        members,
        createMember,
        updateMember,
        deleteMember,
        refreshMembers,
    };
}