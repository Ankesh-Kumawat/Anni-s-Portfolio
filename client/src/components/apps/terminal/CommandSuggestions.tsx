import { Command as LucideCommand } from "lucide-react";

interface CommandSuggestionsProps {
    onCommandClick: (command: string) => void;
}

export const COMMAND_LIST = [
    { cmd: "help", desc: "Show all available commands", category: "Info" },
    { cmd: "ls", desc: "List files and directories", category: "Files" },
    { cmd: "cat about", desc: "Read about file", category: "Files" },
    { cmd: "cat skills", desc: "View skills JSON", category: "Files" },
    { cmd: "cat contact", desc: "Show contact info", category: "Files" },
    { cmd: "open about", desc: "Open About app", category: "Apps" },
    { cmd: "open projects", desc: "Open Projects app", category: "Apps" },
    { cmd: "open vscode", desc: "Open VS Code", category: "Apps" },
    { cmd: "open browser", desc: "Open Browser", category: "Apps" },
    { cmd: "open calculator", desc: "Open Calculator", category: "Apps" },
    { cmd: "open notepad", desc: "Open Notepad", category: "Apps" },
    { cmd: "open gallery", desc: "Open Gallery", category: "Apps" },
    { cmd: "open contact", desc: "Open Contact form", category: "Apps" },
    { cmd: "open settings", desc: "Open Settings", category: "Apps" },
    { cmd: "whoami", desc: "Display current user", category: "Info" },
    { cmd: "date", desc: "Show current date/time", category: "Info" },
    { cmd: "echo hello", desc: "Print text to terminal", category: "Utils" },
    { cmd: "clear", desc: "Clear terminal screen", category: "Utils" },
];

export function CommandSuggestions({ onCommandClick }: CommandSuggestionsProps) {
    const categories = Array.from(new Set(COMMAND_LIST.map(c => c.category)));

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-2 text-cyan-400 mb-4">
                <LucideCommand className="w-5 h-5" />
                <h3 className="text-lg font-bold">Available Commands</h3>
            </div>

            {categories.map(category => (
                <div key={category} className="space-y-2">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        {category}
                    </div>
                    <div className="grid gap-2">
                        {COMMAND_LIST.filter(c => c.category === category).map(({ cmd, desc }) => (
                            <button
                                key={cmd}
                                onClick={() => onCommandClick(cmd)}
                                className="group flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-cyan-500/50 transition-all text-left"
                            >
                                <span className="text-cyan-400 font-mono text-sm font-medium group-hover:text-cyan-300 min-w-[120px]">
                                    $ {cmd}
                                </span>
                                <span className="text-zinc-400 text-sm group-hover:text-zinc-300">
                                    {desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
                💡 Tip: Click any command to execute it instantly
            </div>
        </div>
    );
}
