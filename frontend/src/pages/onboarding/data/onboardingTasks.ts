export type Task = {
    id: number;
    title: string;
    description: string;
    status: string;
};

export const onboardingTasks: Task[] = [
    {
        id: 1,
        title: "Install Linux Environment",
        description:
            "Install a supported Linux distribution such as Debian or Ubuntu. Verify that the operating system is working correctly and that you can access the terminal for development.",
        status: "Pending",
    },
    {
        id: 2,
        title: "Configure Git & GitLab",
        description:
            "Create or configure your GitLab account, generate SSH keys if required, configure Git with your name and email, and verify that you can clone and push repositories.",
        status: "Pending",
    },
    {
        id: 3,
        title: "Setup Docker",
        description:
            "Install Docker and verify that Docker Engine is running properly. Ensure containers can be created successfully before proceeding with development.",
        status: "Pending",
    },
    {
        id: 4,
        title: "Install Development Tools",
        description:
            "Install all required development tools including Node.js, npm, Git, VS Code, and any additional tools mentioned in the onboarding documentation.",
        status: "Pending",
    },
    {
        id: 5,
        title: "Verify Development Environment",
        description:
            "Confirm that all required software is installed correctly and verify that the project builds and runs successfully on your local machine.",
        status: "Pending",
    },
];