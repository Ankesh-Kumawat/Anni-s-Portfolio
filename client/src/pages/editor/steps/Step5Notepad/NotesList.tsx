import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Pin, FileText, Check, Trash2, Eye, EyeOff } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NotesListProps {
    sortedNotes: Array<{
        id: string;
        title: string;
        content: string;
        isPinned: boolean;
    }>;
    notes: Array<{
        id: string;
        title: string;
        content: string;
        isPinned: boolean;
    }>;
    expandedNote: number | null;
    previewMode: { [key: number]: boolean };
    setExpandedNote: (index: number | null) => void;
    updateNote: (index: number, field: string, value: any) => void;
    togglePin: (index: number) => void;
    removeNote: (index: number) => void;
    togglePreview: (index: number) => void;
}

export default function NotesList({
    sortedNotes,
    notes,
    expandedNote,
    previewMode,
    setExpandedNote,
    updateNote,
    togglePin,
    removeNote,
    togglePreview
}: NotesListProps) {
    return (
        <div className="space-y-5">
            {sortedNotes.map((note) => {
                const originalIndex = notes.findIndex(n => n.id === note.id);
                const isExpanded = expandedNote === originalIndex;
                const isComplete = !!(note.title && note.content);
                const isPreview = previewMode[originalIndex];

                return (
                    <div key={note.id} className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        {/* Note Header */}
                        <div
                            className="p-6 cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => setExpandedNote(isExpanded ? null : originalIndex)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl ${note.isPinned ? "bg-primary" : "bg-primary"} flex items-center justify-center flex-shrink-0`}>
                                        {note.isPinned ? (
                                            <Pin className="w-6 h-6 text-primary-foreground" />
                                        ) : (
                                            <FileText className="w-6 h-6 text-primary-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-foreground text-lg">
                                                {note.title || `Note #${originalIndex + 1}`}
                                            </h4>
                                            {isComplete && (
                                                <Badge className="bg-primary/10 text-primary border-primary">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Complete
                                                </Badge>
                                            )}
                                            {note.isPinned && (
                                                <Badge className="bg-primary/10 text-primary border-primary">
                                                    <Pin className="w-3 h-3 mr-1" />
                                                    Pinned
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {note.content || "No content added"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePin(originalIndex);
                                        }}
                                        variant="ghost"
                                        size="sm"
                                        className={note.isPinned ? "text-primary hover:text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}
                                    >
                                        <Pin className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeNote(originalIndex);
                                        }}
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                            <div className="border-t bg-muted p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">Note Title *</Label>
                                    <Input
                                        value={note.title}
                                        onChange={(e) => updateNote(originalIndex, "title", e.target.value)}
                                        placeholder="My Awesome Note"
                                        className="h-11 text-base bg-card"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold text-foreground">Content (Markdown Supported) *</Label>
                                        <Button
                                            type="button"
                                            onClick={() => togglePreview(originalIndex)}
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            {isPreview ? (
                                                <>
                                                    <EyeOff className="w-4 h-4" />
                                                    Edit
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-4 h-4" />
                                                    Preview
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {isPreview ? (
                                        <div className="min-h-[300px] p-4 bg-card rounded-lg border-2 border prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    a: ({ node, ...props }) => (
                                                        <a
                                                            {...props}
                                                            className="text-primary hover:underline"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        />
                                                    )
                                                }}
                                            >
                                                {note.content || "No content to preview"}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <Textarea
                                            value={note.content}
                                            onChange={(e) => updateNote(originalIndex, "content", e.target.value)}
                                            placeholder="# Heading&#10;&#10;Write your note content here...&#10;&#10;Supports **Markdown** formatting!"
                                            rows={12}
                                            className="resize-none text-base bg-card font-mono"
                                        />
                                    )}
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground">{note.content.length} characters</p>
                                        <p className="text-xs text-muted-foreground/60">Markdown: # heading, **bold**, *italic*, - list</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
