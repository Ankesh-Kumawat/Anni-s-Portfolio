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
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">System Status</span>
            </div>

            <div className="space-y-3">
                {/* Zoom Status */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/5 text-white/70 group-hover:bg-white/10 transition-colors">
                            <ZoomIn className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-medium text-white/80">Browser Zoom</span>
                    </div>
                    <span
                        className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-full",
                            isZoomOptimal
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-orange-500/10 text-orange-400"
                        )}
                    >
                        {isZoomOptimal ? "Optimized" : `${zoomLevel}% (Rec: 80%)`}
                    </span>
                </div>

                {/* Battery Status */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                         <div className="p-1.5 rounded-lg bg-white/5 text-white/70 group-hover:bg-white/10 transition-colors">
                            {isCharging ? (
                                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                                <Battery className="w-3.5 h-3.5" />
                            )}
                        </div>
                        <span className="text-[11px] font-medium text-white/80">Battery</span>
                    </div>
                    {batteryLevel !== null ? (
                        <span className="text-[11px] font-bold tabular-nums text-white/90">
                            {batteryLevel}% {isCharging && <span className="text-emerald-400 ml-1">⚡</span>}
                        </span>
                    ) : (
                        <span className="text-[10px] text-white/40 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3" />
                            Not available
                        </span>
                    )}
                </div>
            </div>
            
            <p className="text-[9px] text-white/30 text-center pt-1 font-medium">
                Read-only system info. Limited by browser.
            </p>
        </div>
    );
}
