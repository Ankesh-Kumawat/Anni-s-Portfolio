import { useState, useEffect } from "react";
import {
    Activity,
    Bell,
    Mail,
    Globe,
    Shield,
    Eye,
    Clock,
    Monitor,
    AppWindow,
    ChevronRight,
    BatteryCharging,
    BatteryFull,
    BatteryMedium,
    BatteryLow,
    Wifi,
    WifiOff,
} from "lucide-react";
import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";

export function SystemStatus() {
    const { notifications, openWindows } = useOS();
    const unreadCount = notifications.filter((n) => !n.read).length;
    const latestNotification = notifications[0];

    // Real data states
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [uptime, setUptime] = useState(0);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Real online/offline detection
    useEffect(() => {
        const goOnline = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);
        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);
        return () => {
            window.removeEventListener("online", goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, []);

    // Real session uptime
    useEffect(() => {
        const interval = setInterval(() => {
            setUptime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Real Battery API
    useEffect(() => {
        const getBattery = async () => {
            if ("getBattery" in navigator) {
                try {
                    const battery = await (navigator as any).getBattery();
                    setBatteryLevel(Math.round(battery.level * 100));
                    setIsCharging(battery.charging);

                    battery.addEventListener("levelchange", () => {
                        setBatteryLevel(Math.round(battery.level * 100));
                    });
                    battery.addEventListener("chargingchange", () => {
                        setIsCharging(battery.charging);
                    });
                } catch {
                    // Battery API not supported
                }
            }
        };
        getBattery();
    }, []);

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    const BatteryIcon = () => {
        if (isCharging) return <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />;
        if (batteryLevel === null) return <BatteryFull className="w-3.5 h-3.5 text-white/40" />;
        if (batteryLevel > 60) return <BatteryFull className="w-3.5 h-3.5 text-emerald-400" />;
        if (batteryLevel > 25) return <BatteryMedium className="w-3.5 h-3.5 text-amber-400" />;
        return <BatteryLow className="w-3.5 h-3.5 text-red-400" />;
    };

    const batteryColor = () => {
        if (batteryLevel === null) return "text-white/40";
        if (isCharging) return "text-emerald-400";
        if (batteryLevel > 60) return "text-emerald-400";
        if (batteryLevel > 25) return "text-amber-400";
        return "text-red-400";
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl transition-all duration-500",
                isHovered ? "shadow-cyan-500/10 border-cyan-500/20" : ""
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background:
                    "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,20,35,0.95) 50%, rgba(10,15,30,0.95) 100%)",
            }}
        >
            {/* Ambient glow background */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(at 20% 20%, rgba(6,182,212,0.12) 0%, transparent 50%), 
                                      radial-gradient(at 80% 80%, rgba(139,92,246,0.10) 0%, transparent 50%)`,
                }}
            />

            {/* Content */}
            <div className="relative p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                    background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
                                    boxShadow: "0 0 12px rgba(6,182,212,0.4), 0 0 24px rgba(139,92,246,0.2)",
                                }}
                            >
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                            {/* Live status dot */}
                            <div
                                className={cn(
                                    "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f172a]",
                                    isOnline ? "bg-emerald-400" : "bg-red-400"
                                )}
                            >
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-full animate-ping opacity-50",
                                        isOnline ? "bg-emerald-400" : "bg-red-400"
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="font-bold text-[11px] text-white/90 block leading-tight">
                                System Monitor
                            </span>
                            <span
                                className={cn(
                                    "text-[9px] font-semibold uppercase tracking-wider",
                                    isOnline ? "text-emerald-400" : "text-red-400"
                                )}
                            >
                                {isOnline ? "All Systems Go" : "Offline"}
                            </span>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5">
                        {unreadCount > 0 && (
                            <div className="relative">
                                <Bell className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                <div
                                    className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(135deg, #ef4444, #f97316)",
                                        boxShadow: "0 0 6px rgba(239,68,68,0.5)",
                                    }}
                                >
                                    <span className="text-[7px] text-white font-bold">
                                        {unreadCount}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div
                            className="px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider"
                            style={{
                                background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))",
                                border: "1px solid rgba(6,182,212,0.2)",
                                color: "#67e8f9",
                            }}
                        >
                            v2.0
                        </div>
                    </div>
                </div>

                {/* Notification or Stats Grid */}
                {latestNotification ? (
                    <div
                        className="rounded-xl p-2.5 space-y-1.5"
                        style={{
                            background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.06))",
                            border: "1px solid rgba(6,182,212,0.15)",
                        }}
                    >
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                            <span className="text-[10px] font-semibold text-cyan-300 truncate flex-1">
                                {latestNotification.title}
                            </span>
                            <ChevronRight className="w-3 h-3 text-white/20 flex-shrink-0" />
                        </div>
                        <p className="text-[9px] text-white/50 line-clamp-1 pl-[18px]">
                            {latestNotification.message}
                        </p>
                    </div>
                ) : (
                    /* Real Stats Grid */
                    <div className="grid grid-cols-2 gap-2">
                        {/* Session Uptime */}
                        <div
                            className="rounded-xl p-2.5 flex items-center gap-2.5"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
                                }}
                            >
                                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                                <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider block">
                                    Session
                                </span>
                                <span className="text-[11px] font-bold text-emerald-400 block tabular-nums">
                                    {formatUptime(uptime)}
                                </span>
                            </div>
                        </div>

                        {/* Open Windows */}
                        <div
                            className="rounded-xl p-2.5 flex items-center gap-2.5"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))",
                                }}
                            >
                                <AppWindow className="w-3.5 h-3.5 text-cyan-400" />
                            </div>
                            <div className="min-w-0">
                                <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider block">
                                    Windows
                                </span>
                                <span className="text-[11px] font-bold text-cyan-400 block">
                                    {openWindows.length} Open
                                </span>
                            </div>
                        </div>

                        {/* Battery */}
                        <div
                            className="rounded-xl p-2.5 flex items-center gap-2.5"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: `linear-gradient(135deg, ${batteryLevel !== null && batteryLevel <= 25 ? "rgba(239,68,68,0.2), rgba(239,68,68,0.05)" : "rgba(139,92,246,0.2), rgba(139,92,246,0.05)"})`,
                                }}
                            >
                                <BatteryIcon />
                            </div>
                                <div className="min-w-0">
                                    <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider block">
                                        Battery
                                    </span>
                                    <span className={cn("text-[11px] font-bold block", batteryColor())}>
                                        {batteryLevel !== null
                                            ? `${batteryLevel}%${isCharging ? " ⚡" : ""}`
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* Network Status */}
                            <div
                                className="rounded-xl p-2.5 flex items-center gap-2.5"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{
                                        background: `linear-gradient(135deg, ${isOnline ? "rgba(236,72,153,0.2), rgba(236,72,153,0.05)" : "rgba(239,68,68,0.2), rgba(239,68,68,0.05)"})`,
                                    }}
                                >
                                    {isOnline ? (
                                        <Wifi className="w-3.5 h-3.5 text-pink-400" />
                                    ) : (
                                        <WifiOff className="w-3.5 h-3.5 text-red-400" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider block">
                                        Network
                                    </span>
                                    <span
                                        className={cn(
                                            "text-[11px] font-bold block",
                                            isOnline ? "text-pink-400" : "text-red-400"
                                        )}
                                    >
                                        {isOnline ? "Connected" : "Offline"}
                                    </span>
                                </div>
                        </div>
                    </div>
                )}

                {/* Bottom Bar */}
                <div
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-medium text-emerald-400">Secure</span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                        <Monitor className="w-3 h-3 text-cyan-400" />
                        <span className="text-[9px] font-medium text-white/50">
                            {window.innerWidth}×{window.innerHeight}
                        </span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                        <Eye className="w-3 h-3 text-violet-400" />
                        <span className="text-[9px] font-medium text-white/50">
                            {new Date().toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Hover shine effect */}
            <div
                className={cn(
                    "absolute inset-0 transition-opacity duration-700 pointer-events-none",
                    isHovered ? "opacity-100" : "opacity-0"
                )}
                style={{
                    background:
                        "linear-gradient(105deg, transparent 40%, rgba(6,182,212,0.06) 45%, rgba(139,92,246,0.04) 55%, transparent 60%)",
                }}
            />
        </div>
    );
}
