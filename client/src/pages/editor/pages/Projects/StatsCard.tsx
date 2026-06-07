import { Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EditorData } from "../../types";

interface StatsCardProps {
    data: EditorData;
}

export function StatsCard({ data }: StatsCardProps) {
    return (
        <div className="editor-panel">
            <div className="editor-panel-header">
                <div className="flex items-center gap-3">
                    <div className="editor-panel-icon">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="editor-panel-eyebrow">Inspector</p>
                        <h3>Statistics</h3>
                    </div>
                </div>
            </div>
            <div className="editor-panel-body space-y-3">
                <div className="editor-metric">
                    <span className="text-sm font-medium text-foreground">Total Projects</span>
                    <span className="text-2xl font-bold text-primary">{data.projects.projects.length}</span>
                </div>
                <div className="editor-metric">
                    <span className="text-sm font-medium text-foreground">Complete</span>
                    <span className="text-2xl font-bold text-primary">
                        {data.projects.projects.filter(p => p.name && p.tagline && p.description).length}
                    </span>
                </div>
                <div className="editor-metric neutral">
                    <span className="text-sm font-medium text-foreground">Total Images</span>
                    <span className="text-2xl font-bold text-foreground">
                        {data.projects.projects.reduce((acc, p) => acc + p.images.length, 0)}
                    </span>
                </div>
                <div className="editor-metric">
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-medium text-foreground">In JSON</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                        {data.projects.projects.reduce((acc, p) => acc + Math.min(6, p.images.length), 0)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function HelpCard() {
    return (
        <div className="bg-card rounded-2xl p-6 border-2 border">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary fill-primary" />
                Image Management
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong className="text-foreground">Upload unlimited</strong> images per project</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong className="text-foreground">Drag to reorder</strong> - arrange priority</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong className="text-foreground">First image</strong> = Cover image</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong className="text-foreground">Top 6 images</strong> saved to JSON</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Images auto-sync to Gallery section</span>
                </li>
            </ul>
        </div>
    );
}
