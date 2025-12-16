import { useState, useRef, useEffect } from "react";
import { useOS } from "@/lib/os-context";
import { Command } from "./types";
import { handleCommand as processCommand } from "./commands";
import { CommandSuggestions } from "./CommandSuggestions";
import { Terminal as TerminalIcon, Sparkles, ChevronRight } from "lucide-react";

export default function Terminal() {
    const { launchApp } = useOS();
    const [history, setHistory] = useState<Command[]>([
        {
            input: "welcome",
            output: (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-bold">Portfolio Terminal v3.0</span>
                    </div>
                    <div className="text-zinc-400">
                        Type <span className="text-cyan-400 font-mono">commands</span> to see all available commands
                    </div>
                </div>
            )
        }
    ]);
    const [input, setInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleCommandInput = (cmd: string) => {
        const trimmedCmd = cmd.trim().toLowerCase();

        // Handle special commands
        if (trimmedCmd === "clear") {
            setHistory([]);
            setShowSuggestions(false);
            return;
        }

        if (trimmedCmd === "commands") {
            setShowSuggestions(true);
            setHistory(prev => [
                ...prev,
                {
                    input: cmd,
                    output: <CommandSuggestions onCommandClick={handleCommandInput} />
                }
            ]);
            return;
        }

        if (trimmedCmd === "") {
            return;
        }

        const output = processCommand(cmd, launchApp);
        setHistory(prev => [...prev, { input: cmd, output }]);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCommandInput(input);
            setInput("");
        }
    };

    return (
        <div className="h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 font-mono overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-zinc-300">Terminal</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>visitor@portfolio</span>
                    <span>•</span>
                    <span className="text-cyan-400">~</span>
                </div>
            </div>

            {/* Terminal Content */}
            <div
                className="flex-1 p-4 overflow-y-auto no-scrollbar text-sm"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="space-y-4 max-w-4xl mx-auto">
                    {history.map((entry, i) => (
                        <div key={i} className="space-y-2">
                            {/* Command Input Line */}
                            <div className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-cyan-400" />
                                <span className="text-zinc-500">$</span>
                                <span className="text-zinc-100 font-medium">{entry.input}</span>
                            </div>
                            {/* Command Output */}
                            <div className="pl-7 text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {entry.output}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Line */}
                <div className="flex items-center gap-2 mt-4 max-w-4xl mx-auto">
                    <ChevronRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-zinc-500">$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none flex-1 caret-cyan-400 text-zinc-100 placeholder:text-zinc-700"
                        placeholder="Type a command..."
                        autoFocus
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>

                <div ref={bottomRef} />
            </div>

            {/* Footer Hint */}
            <div className="px-4 py-2 bg-zinc-900/30 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
                <span>
                    💡 Type <span className="text-cyan-400 font-mono">commands</span> to see all available commands
                </span>
                <span className="hidden sm:inline">Press Enter to execute</span>
            </div>
        </div>
    );
}
