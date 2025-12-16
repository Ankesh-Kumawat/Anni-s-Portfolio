import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCw, Star, Lock } from "lucide-react";

interface BrowserToolbarProps {
    url: string;
    loading: boolean;
    onUrlChange: (url: string) => void;
    onRefresh: () => void;
}

export function BrowserToolbar({ url, loading, onUrlChange, onRefresh }: BrowserToolbarProps) {
    return (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/20">
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh}>
                    <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="flex-1 flex items-center gap-2 px-3 h-9 bg-background border rounded-full text-sm shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Lock className="w-3 h-3 text-muted-foreground" />
                <Input
                    value={url}
                    onChange={(e) => onUrlChange(e.target.value)}
                    className="border-none h-full shadow-none focus-visible:ring-0 px-0"
                />
                <Star className="w-3 h-3 text-muted-foreground hover:text-yellow-400 cursor-pointer" />
            </div>
        </div>
    );
}
