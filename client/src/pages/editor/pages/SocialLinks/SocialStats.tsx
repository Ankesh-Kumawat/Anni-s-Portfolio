import { Sparkles } from "lucide-react";
import { POPULAR_PLATFORMS } from "./platforms";

interface SocialStatsProps {
    links: Array<{
        name: string;
        url: string;
        platform: string;
    }>;
}

export default function SocialStats({ links }: SocialStatsProps) {
    return (
        <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
            <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">Statistics</h4>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary">
                    <span className="text-sm font-medium text-foreground">Selected</span>
                    <span className="text-2xl font-bold text-primary">{links.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary">
                    <span className="text-sm font-medium text-foreground">With URL</span>
                    <span className="text-2xl font-bold text-primary">
                        {links.filter(link => link.url).length}
                    </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border">
                    <span className="text-sm font-medium text-foreground">Available</span>
                    <span className="text-2xl font-bold text-foreground">{POPULAR_PLATFORMS.length}</span>
                </div>
            </div>
        </div>
    );
}
