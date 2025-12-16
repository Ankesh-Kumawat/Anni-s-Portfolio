import { useState, useEffect } from "react";
import { Note, ViewMode } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Grid3x3, List, StickyNote } from "lucide-react";
import { NoteCard } from "./components/NoteCard";
import { NoteEditor } from "./components/NoteEditor";

const DEFAULT_NOTES: Note[] = [
    {
        id: "about-me",
        title: "About Me",
        content: `# Hello, I'm Anni 👋

I'm a passionate developer who loves building creative and functional web applications. I specialize in creating OS-like interfaces and modern web experiences that feel native and intuitive.

## Who Am I?
A full-stack developer with a keen eye for design and user experience. I believe in building products that are not just functional, but delightful to use.

## What I Do
- 🎨 Design & develop OS-style interfaces
- 💻 Build full-stack web applications
- 📱 Create Flutter mobile apps
- 🤖 Experiment with AI-assisted tools
- ✨ Focus on creative UI/UX solutions

## Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS, Next.js
**Backend:** Node.js, Express, PostgreSQL, MongoDB
**Mobile:** Flutter, Dart
**Tools:** Docker, Git, VS Code, Figma

## My Philosophy
Simple > Flashy
Working > Perfect
Honest > Fake
User Experience > Everything

## What I've Created
- OS-style Portfolio (this website!)
- Flutter E-commerce App
- AI Chat Assistant
- Task Management System
- Weather Dashboard
- Music Player App
- Real-time Chat Application
- Portfolio Generator Tool

## Current Focus
Building interfaces that feel like real operating systems - complete with windows, taskbars, file systems, and native interactions. Making the web feel more tangible and interactive.

## Get in Touch
📧 Email: hello@example.com
🐙 GitHub: github.com/example
🐦 Twitter: @example
💼 LinkedIn: linkedin.com/in/example

---

Feel free to explore all the apps and features in this portfolio. Each app is fully functional and demonstrates different aspects of my work!`,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: true,
        tags: []
    }
];

export default function Notepad() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Load notes from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('notepad-notes');
        if (saved) {
            const parsed = JSON.parse(saved);
            setNotes(parsed.map((n: any) => ({
                ...n,
                createdAt: new Date(n.createdAt),
                updatedAt: new Date(n.updatedAt)
            })));
        } else {
            setNotes(DEFAULT_NOTES);
        }
    }, []);

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
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-primary" />
                    <h1 className="font-bold text-lg">Notepad</h1>
                    <span className="text-xs text-muted-foreground">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="pl-9 h-9 w-64"
                        />
                    </div>
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
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
                    <Button onClick={createNewNote} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Note
                    </Button>
                </div>
            </div>

            {/* Notes Grid/List */}
            <div className="flex-1 overflow-y-auto p-4">
                {sortedNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <StickyNote className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-semibold mb-2">
                            {searchQuery ? 'No notes found' : 'No notes yet'}
                        </p>
                        <p className="text-sm mb-4">
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
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
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
