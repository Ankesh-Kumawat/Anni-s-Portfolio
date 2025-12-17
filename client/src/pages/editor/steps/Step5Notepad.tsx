import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Sparkles, Check, FileText, Pin, Trash2, Eye, EyeOff } from "lucide-react";
import type { StepProps } from "../types";
import { useState } from "react";

export default function Step5Notepad({ data, setData }: StepProps) {
    const [expandedNote, setExpandedNote] = useState<number | null>(null);
    const [previewMode, setPreviewMode] = useState<{ [key: number]: boolean }>({});

    const addNote = () => {
        setData((prev) => ({
            ...prev,
            notepad: {
                defaultNotes: [
                    ...prev.notepad.defaultNotes,
                    {
                        id: `note-${Date.now()}`,
                        title: "",
                        content: "",
                        isPinned: false
                    }
                ]
            }
        }));
        setExpandedNote(data.notepad.defaultNotes.length);
    };

    const removeNote = (index: number) => {
        setData((prev) => ({
            ...prev,
            notepad: {
                defaultNotes: prev.notepad.defaultNotes.filter((_, i) => i !== index)
            }
        }));
        if (expandedNote === index) setExpandedNote(null);
    };

    const updateNote = (index: number, field: string, value: any) => {
        setData((prev) => ({
            ...prev,
            notepad: {
                defaultNotes: prev.notepad.defaultNotes.map((note, i) =>
                    i === index ? { ...note, [field]: value } : note
                )
            }
        }));
    };

    const togglePin = (index: number) => {
        const note = data.notepad.defaultNotes[index];
        updateNote(index, "isPinned", !note.isPinned);
    };

    const togglePreview = (index: number) => {
        setPreviewMode({ ...previewMode, [index]: !previewMode[index] });
    };

    const completionPercentage = () => {
        if (data.notepad.defaultNotes.length === 0) return 0;
        const filledNotes = data.notepad.defaultNotes.filter(note => note.title && note.content).length;
        return Math.round((filledNotes / data.notepad.defaultNotes.length) * 100);
    };

    // Sort notes: pinned first
    const sortedNotes = [...data.notepad.defaultNotes].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
    });

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Notepad</h2>
                        <p className="text-muted-foreground text-lg">Add default notes for your portfolio notepad app</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-4 rounded-2xl border border-primary/30">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {completionPercentage()}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Info Notice */}
            <div className="mb-8 p-6 bg-card border-2 border-primary/30 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-base font-bold text-foreground">Optional Section - Pre-loaded Notes</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Add notes that will appear by default in your portfolio's notepad app. Supports Markdown formatting.
                    </p>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[1fr_380px] gap-8">
                {/* Left Column - Notes */}
                <div className="space-y-6">
                    {/* Add Note Button */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Your Notes</h3>
                                    <p className="text-sm text-muted-foreground">{data.notepad.defaultNotes.length} note{data.notepad.defaultNotes.length !== 1 ? 's' : ''} added</p>
                                </div>
                            </div>
                            <Button onClick={addNote} type="button" size="lg" className="gap-2 px-6">
                                <Plus className="w-4 h-4" />
                                Add Note
                            </Button>
                        </div>
                    </div>

                    {/* Notes List */}
                    {data.notepad.defaultNotes.length === 0 ? (
                        <div className="bg-card rounded-2xl p-12 border-2 border-dashed border text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-muted-foreground/60" />
                            </div>
                            <h4 className="text-lg font-bold text-foreground mb-2">No notes yet</h4>
                            <p className="text-muted-foreground mb-6">Click "Add Note" to create your first note</p>
                            <Button onClick={addNote} type="button" variant="outline" size="lg" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Your First Note
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {sortedNotes.map((note, index) => {
                                const originalIndex = data.notepad.defaultNotes.findIndex(n => n.id === note.id);
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
                                                    <div className={`w-12 h-12 rounded-xl ${note.isPinned ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-blue-500 to-purple-500"} flex items-center justify-center flex-shrink-0`}>
                                                        {note.isPinned ? (
                                                            <Pin className="w-6 h-6 text-white" />
                                                        ) : (
                                                            <FileText className="w-6 h-6 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-bold text-foreground text-lg">
                                                                {note.title || `Note #${originalIndex + 1}`}
                                                            </h4>
                                                            {isComplete && (
                                                                <Badge className="bg-green-100 text-green-700 border-green-500/30">
                                                                    <Check className="w-3 h-3 mr-1" />
                                                                    Complete
                                                                </Badge>
                                                            )}
                                                            {note.isPinned && (
                                                                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
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
                                                        className={note.isPinned ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" : "text-muted-foreground hover:text-foreground hover:bg-muted"}
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
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="border-t bg-gradient-to-br from-muted/30 to-muted/50 p-6 space-y-4">
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
                                                        <div className="min-h-[300px] p-4 bg-card rounded-lg border-2 border prose prose-sm max-w-none">
                                                            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                                                                {note.content || "No content to preview"}
                                                            </pre>
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
                    )}
                </div>

                {/* Right Column - Stats & Info */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
                        <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-foreground">Statistics</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/30">
                                <span className="text-sm font-medium text-primary">Total Notes</span>
                                <span className="text-2xl font-bold text-blue-600">{data.notepad.defaultNotes.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                <span className="text-sm font-medium text-yellow-900">Pinned</span>
                                <span className="text-2xl font-bold text-yellow-600">
                                    {data.notepad.defaultNotes.filter(n => n.isPinned).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-500/30">
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">Complete</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {data.notepad.defaultNotes.filter(n => n.title && n.content).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Markdown Guide */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                        <h4 className="font-bold text-foreground mb-3">📝 Markdown Guide</h4>
                        <div className="space-y-2 text-sm text-foreground font-mono">
                            <div className="flex items-center gap-2">
                                <code className="bg-card px-2 py-1 rounded"># Heading</code>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="bg-card px-2 py-1 rounded">**bold**</code>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="bg-card px-2 py-1 rounded">*italic*</code>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="bg-card px-2 py-1 rounded">- list item</code>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="bg-card px-2 py-1 rounded">[link](url)</code>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-6 border-2 border-primary/30">
                        <h4 className="font-bold text-foreground mb-3">💡 Quick Tips</h4>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Pin important notes to show first</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Use Markdown for formatting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Preview mode to see formatted text</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Notes appear in portfolio notepad app</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}










