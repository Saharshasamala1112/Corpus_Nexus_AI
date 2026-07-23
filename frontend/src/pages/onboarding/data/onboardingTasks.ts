export type Task = {
    id: number;
    title: string;
    status: string;
};

export const onboardingTasks: Task[] = [
    {
        id: 1,
        title: "Install Linux Environment",
        status: "Pending",
    },
    {
        id: 2,
        title: "Configure Git & GitLab",
        status: "Pending",
    },
    {
        id: 3,
        title: "Setup Docker",
        status: "Pending",
    },
    {
        id: 4,
        title: "Install Development Tools",
        status: "Pending",
    },
    {
        id: 5,
        title: "Verify Development Environment",
        status: "Pending",
    },
];