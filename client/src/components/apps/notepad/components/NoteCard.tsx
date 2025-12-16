import { Note } from "../types";
import { Pin, Trash2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from 'react-markdown';

interface NoteCardProps {
    note: Note;
    viewMode: 'grid' | 'list';
    onSelect: (note: Note) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
}

export function NoteCard({ note, viewMode, onSelect, onDelete, onTogglePin }: NoteCardProps) {
    // Get first 150 chars for preview
    const preview = note.content.slice(0, 150);

    if (viewMode === 'list') {
        return (
            <div
                onClick={() => onSelect(note)}
                className="flex items-center gap-4 p-4 bg-background border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {note.isPinned && <Pin className="w-3 h-3 text-orange-500 fill-orange-500" />}
                        <h3 className="font-semibold text-sm truncate">{note.title}</h3>
                    </div>
                    <div className="text-xs text-muted-foreground truncate prose prose-sm dark:prose-invert max-w-none [&>*]:inline">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => <span className="font-bold">{children}</span>,
                                h2: ({ children }) => <span className="font-semibold">{children}</span>,
                                h3: ({ children }) => <span className="font-medium">{children}</span>,
                                p: ({ children }) => <span>{children}</span>,
                                strong: ({ children }) => <strong>{children}</strong>,
                                em: ({ children }) => <em>{children}</em>,
                                a: ({ children }) => <span className="text-blue-500">{children}</span>,
                                ul: ({ children }) => <span>{children}</span>,
                                ol: ({ children }) => <span>{children}</span>,
                                li: ({ children }) => <span>• {children} </span>,
                                code: ({ children }) => <code className="bg-muted px-1 rounded">{children}</code>,
                            }}
                        >
                            {preview}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(note.updatedAt, { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin(note.id);
                        }}
                        className="p-1.5 hover:bg-muted rounded"
                    >
                        <Pin className={`w-4 h-4 ${note.isPinned ? 'text-orange-500 fill-orange-500' : ''}`} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(note.id);
                        }}
                        className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onSelect(note)}
            className="p-4 bg-background border rounded-lg hover:shadow-md cursor-pointer transition-all group relative"
        >
            {note.isPinned && (
                <Pin className="absolute top-2 right-2 w-4 h-4 text-orange-500 fill-orange-500" />
            )}
            <h3 className="font-semibold mb-2 pr-6 truncate">{note.title}</h3>
            <div className="text-sm text-muted-foreground line-clamp-3 mb-3 prose prose-sm dark:prose-invert max-w-none [&>*]:mb-0 [&>*]:mt-0">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <span className="font-bold text-base">{children}</span>,
                        h2: ({ children }) => <span className="font-semibold text-sm">{children}</span>,
                        h3: ({ children }) => <span className="font-medium text-sm">{children}</span>,
                        p: ({ children }) => <span>{children}</span>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em>{children}</em>,
                        a: ({ children }) => <span className="text-blue-500">{children}</span>,
                        ul: ({ children }) => <span>{children}</span>,
                        ol: ({ children }) => <span>{children}</span>,
                        li: ({ children }) => <span>• {children} </span>,
                        code: ({ children }) => <code className="bg-muted px-1 rounded text-xs">{children}</code>,
                    }}
                >
                    {preview}
                </ReactMarkdown>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDistanceToNow(note.updatedAt, { addSuffix: true })}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin(note.id);
                        }}
                        className="p-1 hover:bg-muted rounded"
                    >
                        <Pin className="w-3 h-3" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(note.id);
                        }}
                        className="p-1 hover:bg-destructive/10 hover:text-destructive rounded"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
