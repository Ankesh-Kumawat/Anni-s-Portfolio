import { Note, EditorMode, TodoItem } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Eye, Edit3, ListChecks } from "lucide-react";
import { useState, useEffect } from "react";
import { ChecklistEditor } from "./ChecklistEditor";
import { MarkdownPreview } from "./MarkdownPreview";

interface NoteEditorProps {
    note: Note | null;
    onSave: (note: Note) => void;
    onBack: () => void;
}

export function NoteEditor({ note, onSave, onBack }: NoteEditorProps) {
    const [title, setTitle] = useState(note?.title || "");
    const [content, setContent] = useState(note?.content || "");
    const [editorMode, setEditorMode] = useState<EditorMode>('text');
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [isPreviewMode, setIsPreviewMode] = useState(true); // Default to preview

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);

            // Parse checklist if content has checkboxes
            if (note.content.includes('[ ]') || note.content.includes('[x]')) {
                setEditorMode('checklist');
                parseTodos(note.content);
            }
        }
    }, [note]);

    const parseTodos = (text: string) => {
        const lines = text.split('\n');
        const parsed: TodoItem[] = [];

        lines.forEach((line, index) => {
            if (line.includes('[ ]') || line.includes('[x]')) {
                const completed = line.includes('[x]');
                const text = line.replace(/\[.\]/, '').trim();
                parsed.push({
                    id: `todo-${index}`,
                    text,
                    completed
                });
            }
        });

        if (parsed.length > 0) {
            setTodos(parsed);
        }
    };

    const handleSave = () => {
        let finalContent = content;

        if (editorMode === 'checklist') {
            finalContent = todos.map(todo =>
                `${todo.completed ? '[x]' : '[ ]'} ${todo.text}`
            ).join('\n');
        }

        const savedNote: Note = {
            id: note?.id || `note-${Date.now()}`,
            title: title || "Untitled Note",
            content: finalContent,
            createdAt: note?.createdAt || new Date(),
            updatedAt: new Date(),
            isPinned: note?.isPinned || false,
            tags: note?.tags || []
        };

        onSave(savedNote);
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note title..."
                        className="h-8 border-none bg-transparent focus-visible:ring-0 font-semibold"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {/* Preview/Edit Toggle */}
                    {editorMode !== 'checklist' && (
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                            <button
                                onClick={() => setIsPreviewMode(true)}
                                className={`p-1.5 rounded transition-colors ${isPreviewMode ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                    }`}
                                title="Preview Mode"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsPreviewMode(false)}
                                className={`p-1.5 rounded transition-colors ${!isPreviewMode ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                    }`}
                                title="Edit Mode"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Checklist Mode Toggle */}
                    <button
                        onClick={() => {
                            if (editorMode === 'checklist') {
                                setEditorMode('text');
                            } else {
                                setEditorMode('checklist');
                                setIsPreviewMode(false);
                            }
                        }}
                        className={`p-1.5 rounded transition-colors ${editorMode === 'checklist' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                            }`}
                        title="Checklist Mode"
                    >
                        <ListChecks className="w-4 h-4" />
                    </button>

                    <Button onClick={handleSave} size="sm" className="gap-2">
                        <Save className="w-4 h-4" />
                        Save
                    </Button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto">
                {editorMode === 'checklist' ? (
                    <ChecklistEditor todos={todos} setTodos={setTodos} />
                ) : isPreviewMode ? (
                    <MarkdownPreview content={content} />
                ) : (
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-full resize-none border-none focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed rounded-none whitespace-pre-wrap"
                        placeholder="# Start writing in Markdown...

Use markdown syntax:
- # Heading 1
- ## Heading 2
- **bold** or *italic*
- [link](url)
- - bullet list"
                        spellCheck={false}
                    />
                )}
            </div>

            {/* Status Bar */}
            <div className="border-t bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
                <span>
                    {editorMode === 'checklist' ? 'Checklist' : isPreviewMode ? 'Preview' : 'Edit'} Mode
                </span>
                <div className="flex items-center gap-4">
                    {editorMode === 'checklist' ? (
                        <span>{todos.length} items</span>
                    ) : (
                        <>
                            <span>{content.split('\n').length} lines</span>
                            <span>•</span>
                            <span>{content.length} chars</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
