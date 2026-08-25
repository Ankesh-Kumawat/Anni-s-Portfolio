import React, { useState, useEffect } from "react";
import {
  Volume2,
  Volume,
  Battery,
  BatteryCharging,
  Maximize2,
  Minimize2,
  Trash2,
  Terminal,
  Briefcase,
  User,
  Settings,
  Sun,
  Moon,
  Eye,
  FileText,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VolumeAndBrightness } from "./VolumeAndBrightness";
import { StatusInfo } from "./StatusInfo";
import { useOS } from "@/lib/os-context";
import { useTheme } from "@/components/theme-provider";
import { useBrightness } from "@/lib/brightness-context";
import { useLocation } from "wouter";

interface ControlCenterPopoverProps {
  volume: number[];
  brightness: number[];
  batteryLevel: number | null;
  isCharging: boolean;
  onVolumeChange: (value: number[]) => void;
  onBrightnessChange: (value: number[]) => void;
}

export function ControlCenterPopover({
  volume,
  brightness,
  batteryLevel,
  isCharging,
  onVolumeChange,
  onBrightnessChange,
}: ControlCenterPopoverProps) {
  const { launchApp, clearNotifications, notifications } = useOS();
  const { theme, setTheme } = useTheme();
  const { nightShift, setNightShift } = useBrightness();
  const [, setLocation] = useLocation();

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if current active theme is effectively dark
  const isDark =
    theme === "dark" ||
    theme === "soft-dark" ||
    theme === "forest-green" ||
    theme === "ocean-blue" ||
    theme === "sunset-orange" ||
    theme === "lavender-dream";

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Fullscreen request error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleTheme = () => {
    if (isDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const roundedVol = Math.round(volume[0] || 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-300/80 text-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-zinc-200 transition-all duration-200 outline-none active:scale-95 group shadow-xs cursor-pointer"
          title="Open Control Center"
        >
          {roundedVol === 0 ? (
            <Volume className="w-3.5 h-3.5 text-rose-500 opacity-60" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white" />
          )}

          {/* Battery Capsule pill */}
          <div className="flex items-center gap-1 pl-1 border-l border-zinc-300 dark:border-zinc-700/60">
            {batteryLevel !== null && (
              <span className="text-[11px] font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                {batteryLevel}%
              </span>
            )}
            {isCharging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5px] animate-pulse" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200" />
            )}
          </div>

          <Settings className="w-3 h-3 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[340px] md:w-[380px] p-0 overflow-hidden mr-2 md:mr-4 mt-2 bg-white/98 text-zinc-900 dark:bg-zinc-950/98 dark:text-zinc-100 shadow-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-all duration-200 z-[300]"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="p-4 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold tracking-tight text-zinc-700 dark:text-zinc-300 uppercase flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Control Center
            </span>
          </div>

          {/* Functional Quick Toggles Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all gap-1.5 cursor-pointer ${
                isFullscreen
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-600/20 dark:border-indigo-500/50 dark:text-indigo-400"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              )}
              <span className="text-[10px] font-semibold tracking-wide">
                {isFullscreen ? "Exit Full" : "Fullscreen"}
              </span>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all gap-1.5 cursor-pointer ${
                isDark
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                  : "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/50 dark:text-amber-400"
              }`}
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-[10px] font-semibold tracking-wide">
                {isDark ? "Dark" : "Light"}
              </span>
            </button>

            {/* Night Shift Toggle */}
            <button
              onClick={() => setNightShift(!nightShift)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all gap-1.5 cursor-pointer ${
                nightShift
                  ? "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-600/20 dark:border-amber-500/50 dark:text-amber-400"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              <Eye className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-[10px] font-semibold tracking-wide">
                {nightShift ? "Night ON" : "Night Shift"}
              </span>
            </button>

            {/* Notifications Clear */}
            <button
              onClick={clearNotifications}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-900/80 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white transition-all gap-1.5 text-zinc-600 dark:text-zinc-400 cursor-pointer group/btn"
            >
              <Trash2 className="w-4 h-4 text-rose-500 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-semibold tracking-wide">
                {notifications.length > 0
                  ? `Clear (${notifications.length})`
                  : "Clear Logs"}
              </span>
            </button>
          </div>

          {/* Volume and Brightness Sliders */}
          <VolumeAndBrightness
            volume={volume}
            brightness={brightness}
            onVolumeChange={onVolumeChange}
            onBrightnessChange={onBrightnessChange}
          />

          {/* Quick Apps Shortcut Grid */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-1">
              Quick Launch
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => launchApp("terminal")}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-emerald-400 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:hover:bg-zinc-800 dark:hover:border-emerald-500/40 transition-all gap-1 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-[9px] font-medium">Terminal</span>
              </button>

              <button
                onClick={() => launchApp("projects")}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-purple-400 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:hover:bg-zinc-800 dark:hover:border-purple-500/40 transition-all gap-1 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span className="text-[9px] font-medium">Projects</span>
              </button>

              <button
                onClick={() => launchApp("about")}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-blue-400 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:hover:bg-zinc-800 dark:hover:border-blue-500/40 transition-all gap-1 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-[9px] font-medium">About Me</span>
              </button>

              <button
                onClick={() => launchApp("settings")}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-400 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:hover:bg-zinc-800 dark:hover:border-zinc-400 transition-all gap-1 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-[9px] font-medium">Settings</span>
              </button>
            </div>
          </div>

          {/* System Specs & Battery Status */}
          <StatusInfo batteryLevel={batteryLevel} isCharging={isCharging} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
