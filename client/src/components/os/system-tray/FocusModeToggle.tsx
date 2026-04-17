import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusModeToggleProps {
    focusMode: boolean;
    onToggle: () => void;
}

export function FocusModeToggle({ focusMode, onToggle }: FocusModeToggleProps) {
    return (
        <button 
            onClick={onToggle}
            className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-2 w-full",
                focusMode 
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400" 
                    : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            )}
        >
            <Moon className={cn("w-5 h-5", focusMode && "fill-current")} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{focusMode ? "DND On" : "Focus Off"}</span>
        </button>
    );
}
