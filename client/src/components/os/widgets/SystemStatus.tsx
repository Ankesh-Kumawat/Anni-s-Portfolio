import { Activity } from "lucide-react";

export function SystemStatus() {
    return (
        <div className="bg-gradient-to-br from-orange-500/20 via-yellow-500/10 to-orange-400/20 backdrop-blur-2xl border border-orange-500/30 rounded-2xl p-4 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 h-[140px]">
            <div className="h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                        <span className="font-bold text-xs block">System Status</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-muted-foreground">Online</span>
                        </div>
                    </div>
                </div>

                {/* Status Info */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Focus</span>
                        <span className="font-semibold text-orange-500">Flutter</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-semibold">Portfolio OS v1.0</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-semibold text-emerald-500">Available</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
