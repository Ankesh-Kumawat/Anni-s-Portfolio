import React from "react";
import { AppId } from "@/lib/os-context";
import { CheckCircle2, XCircle, Info, Folder, File } from "lucide-react";

export function handleCommand(cmd: string, launchApp: (AppId: AppId) => void): string | React.ReactNode {
    const cleanCmd = cmd.trim().toLowerCase();
    const parts = cleanCmd.split(" ");
    const command = parts[0];
    const args = parts.slice(1).join(" ");

    switch (command) {
        case "help":
            return (
                <div className="space-y-4">
                    <div className="text-cyan-400 font-bold flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Command Reference
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-[140px_1fr] gap-4 p-2 rounded bg-zinc-900/50">
                            <span className="text-cyan-400 font-mono">commands</span>
                            <span className="text-zinc-400">Show interactive command list</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 p-2 rounded bg-zinc-900/50">
                            <span className="text-cyan-400 font-mono">ls</span>
                            <span className="text-zinc-400">List available files</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 p-2 rounded bg-zinc-900/50">
                            <span className="text-cyan-400 font-mono">cat &lt;file&gt;</span>
                            <span className="text-zinc-400">Read file contents</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 p-2 rounded bg-zinc-900/50">
                            <span className="text-cyan-400 font-mono">open &lt;app&gt;</span>
                            <span className="text-zinc-400">Launch application</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 p-2 rounded bg-zinc-900/50">
                            <span className="text-cyan-400 font-mono">whoami</span>
                            <span className="text-zinc-400">Display current user</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 p-2 rounded bg-zinc-900/50">
                            <span className="text-cyan-400 font-mono">date</span>
                            <span className="text-zinc-400">Show current date/time</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 p-2 rounded bg-zinc-900/50">
                            <span className="text-cyan-400 font-mono">echo &lt;text&gt;</span>
                            <span className="text-zinc-400">Print text to terminal</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 p-2 rounded bg-zinc-900/50">
                            <span className="text-cyan-400 font-mono">clear</span>
                            <span className="text-zinc-400">Clear terminal screen</span>
                        </div>
                    </div>
                    <div className="text-zinc-500 text-xs pt-2 border-t border-zinc-800">
                        💡 Tip: Type <span className="text-cyan-400">commands</span> for an interactive command browser
                    </div>
                </div>
            );

        case "ls":
            return (
                <div className="space-y-3">
                    <div className="text-zinc-500 text-xs">Listing directory contents...</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400">about.txt</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <Folder className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400">projects/</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">skills.json</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400">contact.md</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400">settings.conf</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-red-400" />
                            <span className="text-red-400">resume.pdf</span>
                        </div>
                    </div>
                </div>
            );

        case "whoami":
            return fetch('/data/terminal.json?t=' + Date.now(), { cache: 'no-store' })
                .then(res => res.json())
                .then(data => (
                    <div className="space-y-2">
                        <div className="text-cyan-400 font-bold">{data.username}</div>
                        <div className="text-zinc-500 text-xs">{data.userRole}</div>
                    </div>
                ))
                .catch(() => (
                    <div className="text-red-400">Error loading user data</div>
                ));

        case "date":
            const now = new Date();
            return (
                <div className="space-y-1">
                    <div className="text-cyan-400">{now.toLocaleString()}</div>
                    <div className="text-zinc-500 text-xs">
                        {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            );

        case "echo":
            return args || "";

        case "cat":
            if (args === "about.txt" || args === "about") {
                return fetch('/data/terminal.json?t=' + Date.now(), { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => (
                        <div className="space-y-2 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="text-cyan-400 font-bold">📄 about.txt</div>
                            <div className="text-zinc-300">{data.about}</div>
                        </div>
                    ))
                    .catch(() => <div className="text-red-400">Error loading file</div>);
            } else if (args === "contact.md" || args === "contact") {
                return fetch('/data/terminal.json?t=' + Date.now(), { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => (
                        <div className="space-y-2 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="text-cyan-400 font-bold">📧 contact.md</div>
                            <div className="space-y-1 text-zinc-300">
                                <div>Email: {data.contact.email}</div>
                                <div>Twitter: {data.contact.twitter}</div>
                                <div>GitHub: {data.contact.github}</div>
                                <div>LinkedIn: {data.contact.linkedin}</div>
                            </div>
                        </div>
                    ))
                    .catch(() => <div className="text-red-400">Error loading file</div>);
            } else if (args === "skills.json" || args === "skills") {
                return fetch('/data/terminal.json?t=' + Date.now(), { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => (
                        <div className="space-y-2 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="text-cyan-400 font-bold">⚙️ skills.json</div>
                            <pre className="text-green-400 text-xs overflow-x-auto">
                                {JSON.stringify(data.skills, null, 2)}
                            </pre>
                        </div>
                    ))
                    .catch(() => <div className="text-red-400">Error loading file</div>);
            } else if (!args) {
                return (
                    <div className="flex items-center gap-2 text-orange-400">
                        <XCircle className="w-4 h-4" />
                        <span>usage: cat &lt;filename&gt;</span>
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span>cat: {args}: No such file or directory</span>
                    </div>
                );
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
                "spotify": "spotify",
                "youtube": "youtube",
                "db": "db",
                "database": "db",
            };

            if (appsMap[args]) {
                launchApp(appsMap[args]);
                return (
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Launching {args}...</span>
                    </div>
                );
            } else if (!args) {
                return (
                    <div className="flex items-center gap-2 text-orange-400">
                        <XCircle className="w-4 h-4" />
                        <span>usage: open &lt;app_name&gt;</span>
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span>open: application '{args}' not found</span>
                    </div>
                );
            }

        case "clear":
            return "";

        case "":
            return "";

        default:
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span>command not found: {command}</span>
                    </div>
                    <div className="text-zinc-500 text-xs">
                        Type <span className="text-cyan-400">help</span> or <span className="text-cyan-400">commands</span> to see available commands
                    </div>
                </div>
            );
    }
}
