import { Battery, BatteryCharging, ZoomIn, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusInfoProps {
    zoomLevel: number;
    batteryLevel: number | null;
    isCharging: boolean;
}

export function StatusInfo({ zoomLevel, batteryLevel, isCharging }: StatusInfoProps) {
    const isZoomOptimal = zoomLevel === 80;

    return (
        <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2">System Status</div>

            {/* Zoom Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs">Browser Zoom</span>
                </div>
                <span
                    className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded",
                        isZoomOptimal
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    )}
                >
                    {isZoomOptimal ? "Optimized" : `${zoomLevel}% (Rec: 80%)`}
                </span>
            </div>

            {/* Battery Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isCharging ? (
                        <BatteryCharging className="w-4 h-4 text-green-500" />
                    ) : (
                        <Battery className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-xs">Battery</span>
                </div>
                {batteryLevel !== null ? (
                    <span className="text-xs font-medium">
                        {batteryLevel}% {isCharging && "⚡"}
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Not available
                    </span>
                )}
            </div>

            <p className="text-[10px] text-muted-foreground pt-2 border-t">
                Read-only system information. Browser limitations apply.
            </p>
        </div>
    );
}
