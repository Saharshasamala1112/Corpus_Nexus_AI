import TeamMemberCard from "./TeamMemberCard";

import { cn } from "@/lib/utils";

type TeamGridProps = {
    className?: string;
};

type TeamMemberItem = {
    name: string;
    role: string;
    avatar: string;
    tasksAssigned: number;
    completedTasks: number;
    status: "Online" | "Away" | "Offline";
};

const members: TeamMemberItem[] = [
    {
        name: "Meghana Rao",
        role: "Product Lead",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        tasksAssigned: 12,
        completedTasks: 10,
        status: "Online",
    },
    {
        name: "Rahul Singh",
        role: "AI Engineer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        tasksAssigned: 9,
        completedTasks: 7,
        status: "Away",
    },
    {
        name: "Sarah Chen",
        role: "Design Systems",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        tasksAssigned: 7,
        completedTasks: 6,
        status: "Online",
    },
    {
        name: "Daniel Kim",
        role: "Scrum Master",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        tasksAssigned: 8,
        completedTasks: 5,
        status: "Offline",
    },
    {
        name: "Asha Patel",
        role: "Data Strategist",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        tasksAssigned: 10,
        completedTasks: 9,
        status: "Online",
    },
    {
        name: "Noah Brooks",
        role: "QA Lead",
        avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&q=80",
        tasksAssigned: 6,
        completedTasks: 4,
        status: "Away",
    },
];

export default function TeamGrid({ className }: TeamGridProps) {
    return (
        <section className={cn("w-full", className)}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {members.map((member) => (
                    <TeamMemberCard
                        key={member.name}
                        name={member.name}
                        role={member.role}
                        avatar={member.avatar}
                        tasksAssigned={member.tasksAssigned}
                        completedTasks={member.completedTasks}
                        status={member.status}
                    />
                ))}
            </div>
        </section>
    );
}
