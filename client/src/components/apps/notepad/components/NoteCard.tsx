import { Note } from "../types";
import { Pin, Trash2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
    note: Note;
    viewMode: 'grid' | 'list';
    onSelect: (note: Note) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
}

export function NoteCard({ note, viewMode, onSelect, onDelete, onTogglePin }: NoteCardProps) {
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
                    <p className="text-xs text-muted-foreground truncate whitespace-pre-wrap">{preview}</p>
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
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3 whitespace-pre-wrap">{preview}</p>
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
