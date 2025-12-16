import { useState, useRef, useEffect } from "react";
import { useOS } from "@/lib/os-context";
import { Command } from "./types";
import { handleCommand as processCommand } from "./commands";

export default function Terminal() {
    const { launchApp } = useOS();
    const [history, setHistory] = useState<Command[]>([
        { input: "welcome", output: "Portfolio Shell v2.0. Type 'help' to start." }
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleCommandInput = (cmd: string) => {
        const output = processCommand(cmd, launchApp);

        if (cmd.trim().toLowerCase() === "clear") {
            setHistory([]);
            return;
        }

        if (cmd.trim() === "") {
            return;
        }

        setHistory(prev => [...prev, { input: cmd, output }]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCommandInput(input);
            setInput("");
        }
    };

    return (
        <div
            className="h-full bg-zinc-950 text-zinc-100 font-mono p-4 text-sm overflow-y-auto no-scrollbar"
            onClick={() => document.getElementById("terminal-input")?.focus()}
        >
            <div className="space-y-4">
                {history.map((entry, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex gap-2 text-muted-foreground">
                            <span className="text-green-500">➜</span>
                            <span className="text-blue-500">~</span>
                            <span className="text-zinc-100">{entry.input}</span>
                        </div>
                        <div className="pl-6 text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {entry.output}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-4 text-muted-foreground">
                <span className="text-green-500">➜</span>
                <span className="text-blue-500">~</span>
                <input
                    id="terminal-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none flex-1 caret-green-500 text-zinc-100 placeholder:text-zinc-700"
                    autoFocus
                    autoComplete="off"
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
}
