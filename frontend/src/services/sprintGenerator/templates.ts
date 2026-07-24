import type { SprintTemplate } from "./types";

export const PROJECT_TEMPLATES: Record<string, SprintTemplate> = {
    ai: {
        goal: "Develop an AI-powered application with scalable and reliable intelligent features.",
        stories: [
            "As a user, I want to upload data for AI processing.",
            "As a user, I want AI-generated insights.",
            "As an admin, I want to monitor AI performance.",
            "As a user, I want fast and accurate predictions.",
        ],
        tasks: [
            "Requirement Analysis",
            "Dataset Preparation",
            "Backend API Development",
            "Frontend Integration",
            "Model Testing",
            "Deployment",
        ],
    },

    health: {
        goal: "Develop a secure healthcare management system for patients and medical staff.",
        stories: [
            "Patient Registration",
            "Appointment Booking",
            "Doctor Dashboard",
            "Medical Record Management",
        ],
        tasks: [
            "Patient Module",
            "Appointment API",
            "Doctor Dashboard",
            "Medical Records",
            "Testing",
            "Deployment",
        ],
    },

    education: {
        goal: "Develop an interactive learning management platform.",
        stories: [
            "Student Registration",
            "Course Enrollment",
            "Assignment Submission",
            "Progress Tracking",
        ],
        tasks: [
            "Course Module",
            "Student Dashboard",
            "Assignment System",
            "Assessment Module",
            "Testing",
            "Deployment",
        ],
    },

    ecommerce: {
        goal: "Develop a complete online shopping platform.",
        stories: [
            "Browse Products",
            "Manage Shopping Cart",
            "Secure Checkout",
            "Track Orders",
        ],
        tasks: [
            "Product Catalog",
            "Shopping Cart",
            "Payment Integration",
            "Order Management",
            "Testing",
            "Deployment",
        ],
    },

    chat: {
        goal: "Develop a secure real-time chat application.",
        stories: [
            "User Login",
            "Send Messages",
            "Create Groups",
            "Receive Notifications",
        ],
        tasks: [
            "Authentication",
            "Messaging API",
            "WebSocket Integration",
            "Notification Service",
            "Testing",
            "Deployment",
        ],
    },

    management: {
        goal: "Develop a management system for efficient business operations.",
        stories: [
            "Manage Records",
            "Generate Reports",
            "Assign Tasks",
            "Track Progress",
        ],
        tasks: [
            "Dashboard",
            "CRUD APIs",
            "Reporting Module",
            "Testing",
            "Deployment",
        ],
    },

    default: {
        goal: "Develop the core functionality of the application.",
        stories: [
            "User Authentication",
            "Manage Project Information",
            "Track Project Progress",
            "Generate Reports",
        ],
        tasks: [
            "Requirement Analysis",
            "Database Design",
            "Backend API Development",
            "Frontend Development",
            "Testing",
            "Deployment",
        ],
    },
};