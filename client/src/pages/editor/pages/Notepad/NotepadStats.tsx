import { Sparkles } from "lucide-react";

interface NotepadStatsProps {
    notes: Array<{
        id: string;
        title: string;
        content: string;
        isPinned: boolean;
    }>;
}

export default function NotepadStats({ notes }: NotepadStatsProps) {
    return (
        <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
            <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">Statistics</h4>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary">
                    <span className="text-sm font-medium text-foreground">Total Notes</span>
                    <span className="text-2xl font-bold text-primary">{notes.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary">
                    <span className="text-sm font-medium text-foreground">Pinned</span>
                    <span className="text-2xl font-bold text-primary">
                        {notes.filter(n => n.isPinned).length}
                    </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary">
                    <span className="text-sm font-medium text-foreground">Complete</span>
                    <span className="text-2xl font-bold text-primary">
                        {notes.filter(n => n.title && n.content).length}
                    </span>
                </div>
            </div>
        </div>
    );
}
