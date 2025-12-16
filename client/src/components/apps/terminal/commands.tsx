import React from "react";
import { AppId } from "@/lib/os-context";

export function handleCommand(cmd: string, launchApp: (id: AppId) => void): string | React.ReactNode {
    const cleanCmd = cmd.trim().toLowerCase();
    const parts = cleanCmd.split(" ");
    const command = parts[0];
    const args = parts.slice(1).join(" ");

    switch (command) {
        case "help":
            return (
                <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="text-primary font-bold">ls</span>
                    <span>List available sections</span>
                    <span className="text-primary font-bold">cat</span>
                    <span>Read file (e.g., cat about)</span>
                    <span className="text-primary font-bold">open</span>
                    <span>Open application (e.g., open projects)</span>
                    <span className="text-primary font-bold">whoami</span>
                    <span>Current user info</span>
                    <span className="text-primary font-bold">clear</span>
                    <span>Clear terminal history</span>
                    <span className="text-primary font-bold">date</span>
                    <span>Show current date/time</span>
                    <span className="text-primary font-bold">echo</span>
                    <span>Print text to screen</span>
                </div>
            );

        case "ls":
            return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-blue-400">
                    <span>about.txt</span>
                    <span>projects/</span>
                    <span>skills.json</span>
                    <span>contact.md</span>
                    <span>settings.conf</span>
                    <span>resume.pdf</span>
                </div>
            );

        case "whoami":
            return "visitor@portfolio-os";

        case "date":
            return new Date().toString();

        case "echo":
            return args;

        case "cat":
            if (args === "about.txt" || args === "about") {
                return "Design Engineer based in SF. Passionate about UI/UX and Creative Coding.";
            } else if (args === "contact.md" || args === "contact") {
                return "Email: hello@example.com\nTwitter: @example\nGitHub: github.com/example";
            } else if (args === "skills.json" || args === "skills") {
                return JSON.stringify({
                    languages: ["TypeScript", "Python", "Rust"],
                    frameworks: ["React", "Next.js", "Tailwind"],
                    tools: ["Figma", "Docker", "Git"]
                }, null, 2);
            } else if (!args) {
                return "usage: cat <filename>";
            } else {
                return `cat: ${args}: No such file or directory`;
            }

        case "open":
            const appsMap: Record<string, AppId> = {
                "about": "about",
                "projects": "projects",
                "settings": "settings",
                "terminal": "terminal",
                "vscode": "vscode",
                "browser": "browser",
                "notepad": "notepad",
                "calculator": "calculator",
                "gallery": "gallery",
                "contact": "contact",
            };

            if (appsMap[args]) {
                launchApp(appsMap[args]);
                return `Launching ${args}...`;
            } else if (!args) {
                return "usage: open <app_name>";
            } else {
                return `open: application '${args}' not found`;
            }

        case "clear":
            return "";

        case "":
            return "";

        default:
            return `command not found: ${command}`;
    }
}
