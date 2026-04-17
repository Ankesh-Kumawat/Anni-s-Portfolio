import { useState, useEffect } from "react";
import { Battery, Volume2, BatteryCharging, User, Settings, Maximize2, Minimize2, Trash2, Terminal, Briefcase } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VolumeAndBrightness } from "./VolumeAndBrightness";
import { StatusInfo } from "./StatusInfo";
import { useOS } from "@/lib/os-context";

interface ControlCenterPopoverProps {
    volume: number[];
    brightness: number[];
    zoomLevel: number;
    batteryLevel: number | null;
    isCharging: boolean;
    onVolumeChange: (value: number[]) => void;
    onBrightnessChange: (value: number[]) => void;
}

export function ControlCenterPopover({
    volume,
    brightness,
    zoomLevel,
    batteryLevel,
    isCharging,
    onVolumeChange,
    onBrightnessChange,
}: ControlCenterPopoverProps) {
    const { launchApp, clearNotifications, notifications } = useOS();
    
    // Real Fullscreen state
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all duration-200 outline-none active:scale-95 group border border-transparent hover:border-white/10">
                    <Volume2 className="w-4 h-4 text-foreground/80 group-hover:text-foreground transition-colors" />
                    <div className="flex items-center gap-2">
                        {batteryLevel !== null && (
                            <span className="text-[11px] font-bold tabular-nums text-foreground/90">{batteryLevel}%</span>
                        )}
                        {isCharging ? (
                            <BatteryCharging className="w-4 h-4 text-emerald-400 stroke-[2.5px]" />
                        ) : (
                            <Battery className="w-4 h-4 text-foreground/80 group-hover:text-foreground transition-colors" />
                        )}
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[320px] md:w-[360px] p-0 overflow-hidden mr-0 md:mr-4 mt-2 bg-background/95 md:bg-black/60 backdrop-blur-3xl shadow-2xl rounded-3xl border border-white/10 transition-all duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
                align="end"
                side="bottom"
                sideOffset={8}
            >
                <div className="p-5 space-y-6">
                    {/* Functional Quick Actions Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <button 
                            onClick={toggleFullscreen}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-2 text-white/70 hover:text-white"
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5 text-indigo-400" /> : <Maximize2 className="w-5 h-5 text-indigo-400" />}
                            <span className="text-[9px] font-bold uppercase tracking-wider">{isFullscreen ? "Exit Full" : "Fullscreen"}</span>
                        </button>
                        
                        <button 
                            onClick={clearNotifications}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-2 text-white/70 hover:text-white group/btn"
                        >
                            <Trash2 className="w-5 h-5 text-rose-400 group-hover/btn:scale-110 transition-transform" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">
                                {notifications.length > 0 ? `Clear (${notifications.length})` : "Clear Notifs"}
                            </span>
                        </button>

                        <button 
                            onClick={() => launchApp("projects")}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-2 text-white/70 hover:text-white"
                        >
                            <Briefcase className="w-5 h-5 text-orange-400" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Projects</span>
                        </button>

                        <button 
                            onClick={() => launchApp("terminal")}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-2 text-white/70 hover:text-white"
                        >
                            <Terminal className="w-5 h-5 text-emerald-400" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Terminal</span>
                        </button>

                        <button 
                            onClick={() => launchApp("about")}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-2 text-white/70 hover:text-white"
                        >
                            <User className="w-5 h-5 text-blue-400" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">About Me</span>
                        </button>

                        <button 
                            onClick={() => launchApp("settings")}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-2 text-white/70 hover:text-white"
                        >
                            <Settings className="w-5 h-5 text-zinc-400" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Settings</span>
                        </button>
                    </div>

                    <VolumeAndBrightness
                        volume={volume}
                        brightness={brightness}
                        onVolumeChange={onVolumeChange}
                        onBrightnessChange={onBrightnessChange}
                    />

                    <StatusInfo
                        zoomLevel={zoomLevel}
                        batteryLevel={batteryLevel}
                        isCharging={isCharging}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
