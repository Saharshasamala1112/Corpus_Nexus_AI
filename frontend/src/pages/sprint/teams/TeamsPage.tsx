import { useCallback, useEffect, useMemo, useState } from "react";

import TeamMemberCard from "../../../components/sprint/teams/TeamMemberCard";
import TeamSearch from "../../../components/sprint/teams/TeamSearch";
import TeamStats from "../../../components/sprint/teams/TeamStats";
import { getProjects } from "../../../services/sprint/projectService";
import type { Project, TeamMember } from "../../../types/sprint/project";

interface TeamMemberWithProject extends TeamMember {
    projectId: string;
    projectName: string;
}

export default function Team() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const loadProjects = useCallback(async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProjects();
    }, [loadProjects]);

    const members = useMemo<TeamMemberWithProject[]>(() => {
        return projects.flatMap((project: Project) =>
            project.members.map((member: TeamMember) => ({
                ...member,
                projectId: project.id,
                projectName: project.name,
            }))
        );
    }, [projects]);

    const filteredMembers = useMemo(() => {
        return members.filter((member) =>
            member.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [members, search]);

    const uniqueSkills = useMemo(() => {
        return new Set(members.map((member) => member.skill)).size;
    }, [members]);

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-800">Team</h1>

                <p className="mt-2 text-slate-500">
                    Manage and explore your team members across all projects.
                </p>
            </div>

            <TeamStats
                totalMembers={members.length}
                totalProjects={projects.length}
                totalSkills={uniqueSkills}
            />

            <TeamSearch value={search} onChange={setSearch} />

            {filteredMembers.length === 0 ? (
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                    <p className="text-lg text-slate-500">No team members found.</p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredMembers.map((member) => (
                        <TeamMemberCard
                            key={member.id}
                            projectId={member.projectId}
                            projectName={member.projectName}
                            name={member.name}
                            role={member.role}
                            skill={member.skill}
                            availability={member.availability}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
