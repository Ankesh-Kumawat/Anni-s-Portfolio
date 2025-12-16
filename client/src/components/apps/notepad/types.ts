export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isPinned: boolean;
    tags: string[];
}

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

export type ViewMode = 'grid' | 'list';
export type EditorMode = 'text' | 'markdown' | 'checklist';
