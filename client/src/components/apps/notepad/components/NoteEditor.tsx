import { Note } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MarkdownPreview } from "./MarkdownPreview";

interface NoteEditorProps {
    note: Note | null;
    onSave: (note: Note) => void;
    onBack: () => void;
}

export function NoteEditor({ note, onSave, onBack }: NoteEditorProps) {
    const content = note?.content || "";

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="font-semibold text-lg">{note?.title || "Untitled"}</h2>
                </div>
            </div>

            {/* Preview Only */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <MarkdownPreview content={content} />
            </div>
        </div>
    );
}
