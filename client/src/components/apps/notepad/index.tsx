import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { RotateCcw, FileText } from "lucide-react";

const DEFAULT_CONTENT = `# Hello, I'm Anni

I'm a developer who enjoys building OS-like interfaces, tools, and systems that feel native and intentional.

## What I'm Working On
- OS-style portfolio (this!)
- Flutter & Web applications
- AI-assisted development tools
- Creative UI experiments

## Philosophy
Simple > Flashy
Working > Perfect
Honest > Fake

## Tech Stack
- React, TypeScript, Tailwind
- Node.js, Express
- PostgreSQL, MongoDB
- Docker, Git, VS Code

## Current Focus
Building interfaces that feel like real operating systems - windows, taskbars, file systems, and native interactions. Making the web feel more tangible.

## Get in Touch
Email: hello@example.com
GitHub: github.com/example
Twitter: @example

---

💡 This is a system-generated note. Feel free to edit and explore - changes reset when you refresh.`;

export default function Notepad() {
    const [text, setText] = useState(DEFAULT_CONTENT);
    const [isEdited, setIsEdited] = useState(false);

    const handleReset = () => {
        setText(DEFAULT_CONTENT);
        setIsEdited(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        setIsEdited(true);
    };

    const lineCount = text.split('\n').length;
    const charCount = text.length;

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">System Notepad</span>
                    {isEdited && (
                        <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                            Edited
                        </span>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 gap-2 text-xs"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Default
                </Button>
            </div>

            {/* Editor */}
            <Textarea
                value={text}
                onChange={handleChange}
                className="flex-1 resize-none border-none focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed rounded-none"
                placeholder="Start typing..."
                spellCheck={false}
            />

            {/* Status Bar */}
            <div className="border-t bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="font-medium">System Note</span>
                    <span>•</span>
                    <span className="text-orange-500">Temporary Edits</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>{lineCount} lines</span>
                    <span>•</span>
                    <span>{charCount} chars</span>
                </div>
            </div>

            {/* Info Notice */}
            <div className="px-4 py-2 bg-blue-500/5 border-t border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <span>ℹ️</span>
                <span>Edits are temporary. This note resets when refreshed.</span>
            </div>
        </div>
    );
}
