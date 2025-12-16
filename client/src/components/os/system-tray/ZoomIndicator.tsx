import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoomIndicatorProps {
    zoomLevel: number;
}

export function ZoomIndicator({ zoomLevel }: ZoomIndicatorProps) {
    const isOptimal = zoomLevel === 80;

    return (
        <div
            className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                isOptimal
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
            )}
            title={`Browser zoom: ${zoomLevel}% (Recommended: 80% for best experience)`}
        >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isOptimal ? "Optimized" : `${zoomLevel}%`}</span>
        </div>
    );
}
