import { Button } from "@/components/ui/button";
import { Plus, Sparkles, FileText } from "lucide-react";
import type { StepProps } from "../../types";
import { useState } from "react";
import NotesList from "./NotesList";
import NotepadStats from "./NotepadStats";
import { calculateStep5Completion } from "../../lib/completionCalculator";

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
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2 border">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold text-primary">
                                {calculateStep5Completion(data)}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-primary" />
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
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary" />
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
                        <NotesList
                            sortedNotes={sortedNotes}
                            notes={data.notepad.defaultNotes}
                            expandedNote={expandedNote}
                            previewMode={previewMode}
                            setExpandedNote={setExpandedNote}
                            updateNote={updateNote}
                            togglePin={togglePin}
                            removeNote={removeNote}
                            togglePreview={togglePreview}
                        />
                    )}
                </div>

                {/* Right Column - Stats & Info */}
                <div className="space-y-6">
                    <NotepadStats notes={data.notepad.defaultNotes} />

                    {/* Markdown Guide */}
                    <div className="bg-card rounded-2xl p-6 border-2 border">
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
                    <div className="bg-card rounded-2xl p-6 border-2 border">
                        <h4 className="font-bold text-foreground mb-3">💡 Quick Tips</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Pin important notes to show first</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Use Markdown for formatting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Preview mode to see formatted text</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Notes appear in portfolio notepad app</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
