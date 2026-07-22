import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SprintEmpty from "../../../components/sprint/generator/SprintEmpty";
import SprintProjectCard from "../../../components/sprint/generator/SprintProjectCard";
import SprintSearch from "../../../components/sprint/generator/SprintSearch";
import { generateSprint, getProjects } from "../../../services/sprint/projectService";
import type { Project } from "../../../types/sprint/project";

export default function SprintGenerator() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchProjects() {
            try {
                const data = await getProjects();

                if (!mounted) {
                    return;
                }

                setProjects(data);
            } catch {
                if (mounted) {
                    setProjects([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        void fetchProjects();

        return () => {
            mounted = false;
        };
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) =>
            project.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [projects, search]);

    async function handleGenerate(projectId: string) {
        try {
            setGeneratingId(projectId);

            const response = await generateSprint(projectId);

            if (!response?.sprint) {
                throw new Error("No sprint generated");
            }

            navigate(`/projects/${projectId}`, {
                state: {
                    sprint: response.sprint,
                },
            });
        } catch {
            alert("Failed to generate sprint.");
        } finally {
            setGeneratingId(null);
        }
    }

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-800">Sprint Center</h1>

                <p className="mt-2 text-slate-500">
                    Generate and manage sprint plans for all your projects.
                </p>
            </div>

            <SprintSearch value={search} onChange={setSearch} />

            {filteredProjects.length === 0 ? (
                <SprintEmpty />
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {filteredProjects.map((project) => (
                        <SprintProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            description={project.description}
                            sprintDuration={project.sprintDuration}
                            teamSize={project.teamSize}
                            generating={generatingId === project.id}
                            onGenerate={handleGenerate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
