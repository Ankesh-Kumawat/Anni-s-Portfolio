import { DatabaseTable } from "./types";

export const USER_DATA = [
    { field: "user_id", value: "U-0001" },
    { field: "name", value: "Ankesh Kumawat" },
    { field: "nickname", value: "Anni" },
    { field: "role", value: "System Owner" },
    { field: "profession", value: "Flutter Developer" },
    { field: "primary_stack", value: "Flutter (Android, Web)" },
    { field: "focus_area", value: "Flutter-first development, scalable UI systems" },
    { field: "status", value: "Active" },
    { field: "created_at", value: "2023-01-01" },
    { field: "last_login", value: "Just now" },
];

export const PROJECTS_DATA = {
    "P-001": [
        { field: "project_id", value: "P-001" },
        { field: "name", value: "CineVerse" },
        { field: "type", value: "Mobile Application" },
        { field: "stack", value: "Flutter, Firebase, Google Drive API, AI (Gemini)" },
        { field: "status", value: "Active" },
        { field: "description", value: "Anime & K-drama streaming platform with offline playback, AI assistant, and community features" },
    ],
    "P-002": [
        { field: "project_id", value: "P-002" },
        { field: "name", value: "DevStudio" },
        { field: "type", value: "Platform / Learning App" },
        { field: "stack", value: "Flutter, Web, AI Tools" },
        { field: "status", value: "In Development" },
        { field: "description", value: "Developer learning platform with AI-assisted workflows and community-driven resources" },
    ],
    "P-003": [
        { field: "project_id", value: "P-003" },
        { field: "name", value: "Portfolio OS" },
        { field: "type", value: "Web Application" },
        { field: "stack", value: "React, Vite, Tailwind CSS" },
        { field: "status", value: "Active" },
        { field: "description", value: "OS-style interactive portfolio with desktop environment simulation" },
    ],
    "P-004": [
        { field: "project_id", value: "P-004" },
        { field: "name", value: "MentorHub" },
        { field: "type", value: "Management System" },
        { field: "stack", value: "Flutter (rebuild), Web (legacy)" },
        { field: "status", value: "Rebuilding" },
        { field: "description", value: "School/college management system with multi-role architecture" },
    ],
};

export const DATABASE_TABLES: DatabaseTable[] = [
    {
        id: "users",
        name: "users",
        status: "Active",
        rows: 1,
        size: "2.4 KB",
        updated: "Just now",
        description: "Portfolio owner information and system metadata. This table contains my personal details and professional information.",
        fields: [
            { name: "user_id", type: "VARCHAR(10)", description: "Unique user identifier" },
            { name: "name", type: "VARCHAR(100)", description: "Full name" },
            { name: "nickname", type: "VARCHAR(50)", description: "Preferred name" },
            { name: "role", type: "VARCHAR(50)", description: "System role" },
            { name: "profession", type: "VARCHAR(100)", description: "Primary profession" },
            { name: "primary_stack", type: "VARCHAR(100)", description: "Main technology stack" },
            { name: "focus_area", type: "TEXT", description: "Development focus and expertise" },
            { name: "status", type: "VARCHAR(20)", description: "Account status" },
            { name: "created_at", type: "DATE", description: "Account creation date" },
            { name: "last_login", type: "VARCHAR(50)", description: "Last login timestamp" },
        ],
        usage: "Stores portfolio owner information, professional details, and system metadata for this OS-style portfolio.",
        represents: "This is my actual profile data - demonstrating how I structure user information in a database. Shows understanding of data modeling and personal branding."
    },
    {
        id: "projects",
        name: "projects",
        status: "Active",
        rows: 4,
        size: "12.5 KB",
        updated: "5 mins ago",
        description: "Portfolio projects and work showcase.",
        fields: [
            { name: "project_id", type: "VARCHAR(10)", description: "Unique project identifier" },
            { name: "name", type: "VARCHAR(200)", description: "Project name" },
            { name: "type", type: "VARCHAR(100)", description: "Project type" },
            { name: "stack", type: "VARCHAR(255)", description: "Technologies used" },
            { name: "status", type: "VARCHAR(50)", description: "Project status" },
            { name: "description", type: "TEXT", description: "Project description" },
        ],
        usage: "Tracks portfolio projects, technologies, and deployment information.",
        represents: "Project portfolio and work history."
    },
];
