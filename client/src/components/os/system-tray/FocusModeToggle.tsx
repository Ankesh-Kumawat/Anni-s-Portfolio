import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusModeToggleProps {
    focusMode: boolean;
    onToggle: () => void;
}

export function FocusModeToggle({ focusMode, onToggle }: FocusModeToggleProps) {
    return (
        <div className="bg-muted/30 p-4 rounded-xl border">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg p-2"
            >
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            focusMode
                                ? "bg-orange-500 text-white"
                                : "bg-orange-400/20 text-orange-500"
                        )}
                    >
                        <Moon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold">Focus Mode</span>
                        <span className="text-xs text-muted-foreground">
                            {focusMode ? "Enabled" : "Disabled"}
                        </span>
                    </div>
                </div>
                <div
                    className={cn(
                        "w-10 h-6 rounded-full transition-colors relative",
                        focusMode ? "bg-orange-500" : "bg-muted"
                    )}
                >
                    <div
                        className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                            focusMode ? "translate-x-5" : "translate-x-1"
                        )}
                    />
                </div>
            </button>
            <p className="text-[10px] text-muted-foreground mt-2 px-2">
                Mutes app sounds, disables notifications, and reduces animations
            </p>
        </div>
    );
}
