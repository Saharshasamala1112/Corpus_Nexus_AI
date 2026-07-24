export function generateTimeline(sprintDuration: number): string[] {
    if (sprintDuration <= 1) {
        return [
            "Day 1 : Requirement Analysis",
            "Day 2 : System Design",
            "Day 3-4 : Development",
            "Day 5 : Integration",
            "Day 6 : Testing",
            "Day 7 : Deployment",
        ];
    }

    if (sprintDuration === 2) {
        return [
            "Week 1",
            "• Requirement Analysis",
            "• System Design",
            "• Backend Development",
            "",
            "Week 2",
            "• Frontend Development",
            "• Integration",
            "• Testing",
            "• Deployment",
        ];
    }

    if (sprintDuration === 3) {
        return [
            "Week 1",
            "• Planning & Design",
            "",
            "Week 2",
            "• Backend Development",
            "• Database Integration",
            "",
            "Week 3",
            "• Frontend",
            "• Testing",
            "• Deployment",
        ];
    }

    return [
        "Week 1",
        "• Planning",
        "",
        "Week 2",
        "• Backend Development",
        "",
        "Week 3",
        "• Frontend Development",
        "",
        "Week 4",
        "• Testing",
        "• Deployment",
    ];
}