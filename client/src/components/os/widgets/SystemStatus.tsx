import { Activity, Bell, Mail } from "lucide-react";
import { useOS } from "@/lib/os-context";

export function SystemStatus() {
    const { notifications } = useOS();
    const unreadCount = notifications.filter(n => !n.read).length;
    const latestNotification = notifications[0];

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
                    {unreadCount > 0 && (
                        <div className="relative">
                            <Bell className="w-4 h-4 text-orange-500 animate-pulse" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-[8px] text-white font-bold">{unreadCount}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Latest Notification or Status Info */}
                {latestNotification ? (
                    <div className="space-y-1 bg-black/20 rounded-lg p-2 border border-orange-500/20">
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-orange-500" />
                            <span className="text-[10px] font-semibold text-orange-500">{latestNotification.title}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground line-clamp-2">{latestNotification.message}</p>
                        <span className="text-[8px] text-muted-foreground">
                            {new Date(latestNotification.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}
