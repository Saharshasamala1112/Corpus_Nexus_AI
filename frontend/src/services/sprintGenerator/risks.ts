export function generateRisks(projectType: string): string[] {
    const type = projectType.toLowerCase();

    switch (type) {
        case "ai":
            return [
                "Model accuracy may not meet expectations.",
                "Insufficient or poor-quality training data.",
                "High computational resource usage.",
            ];

        case "health":
            return [
                "Patient data privacy concerns.",
                "Regulatory compliance issues.",
                "Data integrity and security risks.",
            ];

        case "education":
            return [
                "Low student engagement.",
                "Course content delays.",
                "Scalability during peak usage.",
            ];

        case "ecommerce":
            return [
                "Payment gateway failures.",
                "Inventory synchronization issues.",
                "Order processing delays.",
            ];

        case "chat":
            return [
                "High message latency.",
                "Notification delivery failures.",
                "Server scalability issues.",
            ];

        case "management":
            return [
                "Changing business requirements.",
                "Incomplete project documentation.",
                "Resource availability issues.",
            ];

        default:
            return [
                "Requirement changes.",
                "Integration delays.",
                "Testing challenges.",
            ];
    }
}

export function generateAcceptanceCriteria(projectType: string): string[] {
    const type = projectType.toLowerCase();

    switch (type) {
        case "ai":
            return [
                "AI predictions are generated successfully.",
                "Users can submit data for processing.",
                "Results are displayed correctly.",
                "Application passes functional testing.",
            ];

        case "health":
            return [
                "Patients can register successfully.",
                "Appointments can be booked.",
                "Medical records are stored securely.",
                "Application passes security testing.",
            ];

        case "education":
            return [
                "Students can enroll in courses.",
                "Assignments can be submitted.",
                "Progress tracking works correctly.",
                "Application passes usability testing.",
            ];

        case "ecommerce":
            return [
                "Products can be browsed.",
                "Orders can be placed successfully.",
                "Payments complete successfully.",
                "Inventory updates correctly.",
            ];

        case "chat":
            return [
                "Users can send messages.",
                "Messages are delivered instantly.",
                "Notifications work correctly.",
                "Group chats function properly.",
            ];

        case "management":
            return [
                "Users can manage records.",
                "Reports are generated successfully.",
                "Task tracking works correctly.",
                "Application passes functional testing.",
            ];

        default:
            return [
                "Core features are implemented.",
                "Backend APIs are working.",
                "Frontend is integrated successfully.",
                "Testing completed successfully.",
            ];
    }
}