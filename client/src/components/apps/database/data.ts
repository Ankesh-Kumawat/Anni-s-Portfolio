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

];
