import { useState, useEffect } from "react";
import { Note, ViewMode } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Grid3x3, List, StickyNote } from "lucide-react";
import { NoteCard } from "./components/NoteCard";
import { NoteEditor } from "./components/NoteEditor";
import { useFirestoreData } from "@/hooks/useFirestoreData";

interface NotepadData {
    defaultNotes: Array<{
        id: string;
        title: string;
        content: string;
        isPinned: boolean;
    }>;
}

export default function Notepad() {
    const { data: notepadData, loading } = useFirestoreData<NotepadData>("notepad");
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Load default notes from Firestore and merge with localStorage
    useEffect(() => {
        if (notepadData?.defaultNotes) {
            const defaultNotes = notepadData.defaultNotes.map((n: any) => ({
                ...n,
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            // Load notes from localStorage
            const saved = localStorage.getItem('notepad-notes');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setNotes(parsed.map((n: any) => ({
                        ...n,
                        createdAt: new Date(n.createdAt),
                        updatedAt: new Date(n.updatedAt)
                    })));
                } catch (e) {
                    console.error('Error parsing saved notes:', e);
                    setNotes(defaultNotes);
                }
            } else {
                setNotes(defaultNotes);
            }
        }
    }, [notepadData]);

    // Save notes to localStorage
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem('notepad-notes', JSON.stringify(notes));
        }
    }, [notes]);

    const createNewNote = () => {
        const newNote: Note = {
            id: `note-${Date.now()}`,
            title: "Untitled Note",
            content: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            isPinned: false,
            tags: []
        };
        setSelectedNote(newNote);
        setIsEditing(true);
    };

    const saveNote = (note: Note) => {
        setNotes(prev => {
            const existing = prev.find(n => n.id === note.id);
            if (existing) {
                return prev.map(n => n.id === note.id ? note : n);
            }
            return [note, ...prev];
        });
        setIsEditing(false);
        setSelectedNote(null);
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (selectedNote?.id === id) {
            setSelectedNote(null);
            setIsEditing(false);
        }
    };

    const togglePin = (id: string) => {
        setNotes(prev =>
            prev.map(n =>
                n.id === id ? { ...n, isPinned: !n.isPinned } : n
            )
        );
    };

    const selectNote = (note: Note) => {
        setSelectedNote(note);
        setIsEditing(true);
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    if (isEditing) {
        return (
            <NoteEditor
                note={selectedNote}
                onSave={saveNote}
                onBack={() => {
                    setIsEditing(false);
                    setSelectedNote(null);
                }}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-3 border-b bg-muted/20 gap-3">
                <div className="flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-primary" />
                    <h1 className="font-bold text-lg">Notepad</h1>
                    <span className="text-xs text-muted-foreground">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="pl-9 h-9 w-full sm:w-48"
                        />
                    </div>
                    <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                }`}
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Button onClick={createNewNote} size="sm" className="gap-2 shrink-0">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Note</span>
                    </Button>
                </div>
            </div>

            {/* Notes Grid/List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {sortedNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4">
                        <StickyNote className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-20" />
                        <p className="text-base sm:text-lg font-semibold mb-2 text-center">
                            {searchQuery ? 'No notes found' : 'No notes yet'}
                        </p>
                        <p className="text-xs sm:text-sm mb-4 text-center">
                            {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
                        </p>
                        {!searchQuery && (
                            <Button onClick={createNewNote} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Create Note
                            </Button>
                        )}
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
                                : 'space-y-2 max-w-4xl mx-auto'
                        }
                    >
                        {sortedNotes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                viewMode={viewMode}
                                onSelect={selectNote}
                                onDelete={deleteNote}
                                onTogglePin={togglePin}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
