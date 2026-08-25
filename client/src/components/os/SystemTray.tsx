import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Terminal,
  Wifi,
  Info,
  Settings,
} from "lucide-react";
import { useOS } from "@/lib/os-context";
import { useVolume } from "@/lib/volume-context";
import { useBrightness } from "@/lib/brightness-context";
import { ControlCenterPopover } from "./system-tray/ControlCenterPopover";
import { DynamicIslandMedia } from "./system-tray/DynamicIslandMedia";
import { APPS } from "../apps";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export function SystemTray() {
  const { launchApp, activeWindowId } = useOS();
  const [time, setTime] = useState(new Date());
  const { volume, setVolume } = useVolume();
  const { brightness, setBrightness } = useBrightness();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  // Active App Info
  const activeApp = activeWindowId ? APPS.find((a) => a.id === activeWindowId) : null;

  // Real-time clock update
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Battery API (read-only)
  useEffect(() => {
    const getBatteryInfo = async () => {
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
        } catch (error) {
          console.log("Battery API not supported");
        }
      }
    };

    getBatteryInfo();
  }, []);

  return (
    <header className="h-9 px-3 md:px-4 flex items-center justify-between text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800/90 select-none shadow-xs z-[200] relative transition-colors duration-200">
      {/* 🌟 LEFT SECTION: OS Brand & Active App Breadcrumb */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* OS Brand Quick Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-300/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:border-zinc-700/60 hover:border-indigo-500/50 transition-all duration-200 outline-none active:scale-95 group cursor-pointer shadow-xs"
              title="System Menu"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-xs group-hover:rotate-45 transition-transform duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-950" />
              </div>
              <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100 text-xs">
                AniPlix<span className="text-indigo-600 dark:text-indigo-400">OS</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="w-48 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-[300]"
          >
            <DropdownMenuItem
              onClick={() => launchApp("about")}
              className="flex items-center gap-2 px-2.5 py-2 text-xs rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
            >
              <Info className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>About Portfolio OS</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => launchApp("settings")}
              className="flex items-center gap-2 px-2.5 py-2 text-xs rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>System Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => launchApp("terminal")}
              className="flex items-center gap-2 px-2.5 py-2 text-xs rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Terminal CLI</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800 my-1" />

            <DropdownMenuItem
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-2.5 py-2 text-xs rounded-xl cursor-pointer text-amber-600 dark:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-amber-700 dark:hover:text-amber-300"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Restart OS</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dynamic Active App Indicator */}
        {activeApp && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 dark:bg-zinc-900/60 dark:border-zinc-800 dark:text-zinc-300 text-[11px]"
          >
            <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
              {activeApp.icon}
            </span>
            <span className="font-medium truncate max-w-[120px]">{activeApp.title}</span>
          </motion.div>
        )}
      </div>

      {/* 🎵 CENTER SECTION: Dynamic Island Media / Live Visualizer */}
      <div className="flex items-center justify-center">
        <DynamicIslandMedia />
      </div>

      {/* ⚡ RIGHT SECTION: Network Status + Control Center + Date/Time */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Network Status Dot (Online Indicator) */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 dark:bg-zinc-900/50 dark:border-zinc-800/80 text-[11px] dark:text-zinc-400"
          title="Network: Connected"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500"></span>
          </span>
          <Wifi className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
        </div>

        {/* Upgraded Control Center Hub */}
        <ControlCenterPopover
          volume={[Math.round(volume * 100)]}
          brightness={brightness}
          batteryLevel={batteryLevel}
          isCharging={isCharging}
          onVolumeChange={(val) => setVolume(Math.round(val[0]) / 100)}
          onBrightnessChange={setBrightness}
        />

        {/* Live Date & Time Capsule */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 dark:bg-zinc-900/60 dark:border-zinc-800/70 text-[11px] md:text-xs font-semibold tabular-nums dark:text-zinc-200 tracking-tight select-none shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          title={format(time, "EEEE, MMMM do, yyyy")}
        >
          <span>{format(time, "EEE MMM d")}</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-normal">•</span>
          <span className="text-zinc-900 dark:text-zinc-100">{format(time, "h:mm aa")}</span>
        </div>
      </div>
    </header>
  );
}
