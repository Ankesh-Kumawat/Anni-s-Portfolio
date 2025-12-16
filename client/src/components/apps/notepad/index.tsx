import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Notepad() {
    const [text, setText] = useState("Welcome to Notepad!\n\nThis is a simple text editor. You can type here...");

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Menu Bar */}
            <div className="flex items-center gap-1 p-1 border-b text-sm">
                <Button variant="ghost" size="sm" className="h-7 px-2">File</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2">Edit</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2">Format</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2">View</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2">Help</Button>
            </div>

            {/* Editor */}
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 resize-none border-none focus-visible:ring-0 p-4 font-mono text-base leading-relaxed rounded-none"
                placeholder="Start typing..."
            />

            {/* Status Bar */}
            <div className="border-t bg-muted/20 px-4 py-1 text-xs text-muted-foreground flex justify-end gap-4">
                <span>Ln {text.split('\n').length}, Col {text.length}</span>
                <span>UTF-8</span>
                <span>Windows (CRLF)</span>
            </div>
        </div>
    );
}
