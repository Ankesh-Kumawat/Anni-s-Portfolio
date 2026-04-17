import { useState, useEffect } from "react";
import { Battery, Activity, Cpu, Wifi, Globe, Shield, Zap, Server, ChevronRight } from "lucide-react";
import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";

export function SystemStatus() {
    const { notifications, openWindows } = useOS();
    const unreadCount = notifications.filter((n) => !n.read).length;

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [uptime, setUptime] = useState(0);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);
    
    // CPU Simulation state
    const [cpuUsage, setCpuUsage] = useState<number[]>(Array(12).fill(10));
    
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

    useEffect(() => {
        const interval = setInterval(() => {
            setUptime((prev) => prev + 1);
            // Simulate wild CPU fluctuations like a real hacker terminal
            setCpuUsage(prev => {
                const newBars = [...prev.slice(1), Math.floor(Math.random() * 80) + 15];
                return newBars;
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const getBattery = async () => {
            if ("getBattery" in navigator) {
                try {
                    const battery = await (navigator as any).getBattery();
                    setBatteryLevel(Math.round(battery.level * 100));
                    setIsCharging(battery.charging);
                    battery.addEventListener("levelchange", () => setBatteryLevel(Math.round(battery.level * 100)));
                    battery.addEventListener("chargingchange", () => setIsCharging(battery.charging));
                } catch {}
            }
        };
        getBattery();
    }, []);

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate circumference for circular progress
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const currentBat = batteryLevel ?? 100;
    const strokeDashoffset = circumference - (currentBat / 100) * circumference;

    return (
        <div className="relative w-full max-w-sm rounded-[2rem] bg-black/50 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden group">
            
            {/* Animated Edge Light */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(0,255,255,0.4)_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
            
            {/* Inner Content Wrapper */}
            <div className="relative z-10 m-[1px] bg-black/60 rounded-[calc(2rem-1px)] h-full backdrop-blur-xl">
                
                {/* Horizontal Scanline Effect */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.8)_50%,transparent_100%)] h-4 animate-[translate-y_3s_ease-in-out_infinite]" style={{ backgroundSize: "100% 4px" }} />

                <div className="p-6 pb-5 space-y-6">
                    {/* Header HUD */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                                <h3 className="font-black text-white text-[14px] tracking-[0.2em] uppercase">Telemetry</h3>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="h-[2px] w-6 bg-cyan-500/50" />
                                <span className={cn("text-[8px] font-mono tracking-widest", isOnline ? "text-cyan-400" : "text-red-500")}>
                                    LINK: {isOnline ? 'ESTABLISHED' : 'FAILED'}
                                </span>
                            </div>
                        </div>

                        {/* Animated Alert Badge */}
                        <div className="flex flex-col items-end gap-1">
                            <div className="px-2 py-0.5 rounded-sm bg-red-500/20 border border-red-500/50 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                <span className="text-[10px] font-mono font-bold text-red-500">SYS_WARN: {unreadCount}</span>
                            </div>
                            <span className="text-[7px] font-mono text-white/30 tracking-widest">ENCRYPTED // {openWindows.length} PROC</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        
                        {/* Left Side: Circular HUD Data */}
                        <div className="flex flex-col items-center justify-center relative">
                            {/* SVG Ring Progress */}
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    {/* Background Track */}
                                    <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                                    {/* Decorative outer dotted track */}
                                    <circle cx="50" cy="50" r="44" stroke="rgba(6,182,212,0.15)" strokeWidth="1" fill="none" strokeDasharray="3 3" className="animate-[spin_20s_linear_infinite]" />
                                    {/* Progress Ring */}
                                    <circle 
                                        cx="50" cy="50" r={radius} 
                                        stroke={isCharging || currentBat > 20 ? "url(#bat-gradient)" : "url(#bat-red)"} 
                                        strokeWidth="5" fill="none" strokeLinecap="round"
                                        style={{ strokeDasharray: circumference, strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }}
                                    />
                                    <defs>
                                        <linearGradient id="bat-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                        <linearGradient id="bat-red" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ef4444" />
                                            <stop offset="100%" stopColor="#b91c1c" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <Zap className={cn("w-4 h-4 mb-0.5", isCharging ? "text-cyan-400 animate-pulse" : "text-white/40")} />
                                    <span className="text-xl font-black text-white tabular-nums tracking-tighter">
                                        {currentBat}<span className="text-[10px] text-cyan-500">%</span>
                                    </span>
                                </div>
                            </div>
                            <span className="mt-2 text-[8px] font-mono text-white/50 tracking-widest">{isCharging ? "PWR_CHARGING" : "PWR_BATT"}</span>
                        </div>

                        {/* Right Side: Modules */}
                        <div className="flex flex-col gap-3 justify-center">
                            
                            {/* CPU Matrix */}
                            <div className="p-3 bg-white/[0.02] border border-cyan-500/20 rounded-xl relative overflow-hidden group/cpu">
                                <div className="absolute right-0 top-0 text-cyan-900/40 pointer-events-none">
                                    <Cpu className="w-16 h-16 transform rotate-12 scale-150" />
                                </div>
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">CPU_Thread</span>
                                    <span className="text-[10px] font-mono text-white/60 tabular-nums">{cpuUsage[cpuUsage.length-1]}%</span>
                                </div>
                                <div className="flex items-end gap-1 h-8 relative z-10 pl-1">
                                    {cpuUsage.map((val, i) => (
                                        <div key={i} className="w-[4px] bg-cyan-400/80 rounded-t-sm transition-all duration-300" style={{ height: `${val}%` }} />
                                    ))}
                                </div>
                            </div>

                            {/* Uptime Module */}
                            <div className="p-3 bg-white/[0.02] border border-purple-500/20 rounded-xl flex items-center justify-between relative overflow-hidden">
                                <div className="absolute left-[-10px] bottom-[-10px] text-purple-900/40 pointer-events-none">
                                    <Server className="w-12 h-12" />
                                </div>
                                <div className="relative z-10 flex flex-col">
                                    <span className="text-[9px] font-mono text-purple-300 font-bold uppercase mb-0.5">Uptime_CLK</span>
                                    <span className="text-sm font-black tracking-widest text-white tabular-nums">{formatUptime(uptime)}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer HUD Info */}
                    <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                <Shield className="w-3 h-3 text-emerald-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-mono text-white/40">NODE SEC</span>
                                <span className="text-[10px] font-mono font-bold text-emerald-400">VERIFIED</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2.5">
                            <div className="flex flex-col text-right">
                                <span className="text-[8px] font-mono text-white/40">LATENCY</span>
                                <span className="text-[10px] font-mono font-bold text-white/90">
                                    {isOnline ? "12ms" : "---"}
                                </span>
                            </div>
                            <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                                <Globe className={cn("w-3 h-3", isOnline ? "text-cyan-400" : "text-white/40")} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Global Keyframes injected for custom tailwind */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes translate-y {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(500%); }
                }
            `}} />
        </div>
    );
}
