import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCw, Star, Lock, Home } from "lucide-react";
import { KeyboardEvent } from "react";

interface BrowserToolbarProps {
    url: string;
    loading: boolean;
    showHome: boolean;
    onUrlChange: (url: string) => void;
    onNavigate: (url: string) => void;
    onRefresh: () => void;
    onBack: () => void;
    onForward: () => void;
    onHome: () => void;
}

export function BrowserToolbar({
    url,
    loading,
    showHome,
    onUrlChange,
    onNavigate,
    onRefresh,
    onBack,
    onForward,
    onHome
}: BrowserToolbarProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onNavigate(url);
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/20">
            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onBack}
                    disabled={showHome}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onForward}
                    disabled={showHome}
                >
                    <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onRefresh}
                    disabled={showHome}
                >
                    <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${showHome ? "bg-blue-100 text-blue-600" : ""}`}
                    onClick={onHome}
                >
                    <Home className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 flex items-center gap-2 px-3 h-9 bg-background border rounded-full text-sm shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Lock className="w-3 h-3 text-muted-foreground" />
                <Input
                    value={url}
                    onChange={(e) => onUrlChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-none h-full shadow-none focus-visible:ring-0 px-0"
                    placeholder={showHome ? "Search or enter URL..." : "Enter URL..."}
                />
                <Star className="w-3 h-3 text-muted-foreground hover:text-yellow-400 cursor-pointer transition-colors" />
            </div>
        </div>
    );
}
