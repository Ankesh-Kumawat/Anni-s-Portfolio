import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, Monitor, Battery, BatteryCharging, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusInfoProps {
  batteryLevel: number | null;
  isCharging: boolean;
}

export function StatusInfo({ batteryLevel, isCharging }: StatusInfoProps) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (typeof window !== "undefined") {
      setResolution(`${window.screen.width} × ${window.screen.height}`);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/90 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 text-xs">
        <span className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
          System Status
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
          <Shield className="w-3 h-3" /> Ready
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Network State */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/50 shadow-2xs">
          <div
            className={cn(
              "p-1 rounded-lg",
              isOnline
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-500"
            )}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Network</span>
            <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
              {isOnline ? "Connected" : "Offline"}
            </span>
          </div>
        </div>

        {/* Display Resolution */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/50 shadow-2xs">
          <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Monitor className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Display</span>
            <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {resolution || "Standard"}
            </span>
          </div>
        </div>

        {/* Battery Info */}
        <div className="col-span-2 flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/50 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {isCharging ? (
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Battery className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Power Source</span>
              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                {isCharging ? "AC Power / Charging" : "Battery Mode"}
              </span>
            </div>
          </div>
          {batteryLevel !== null && (
            <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {batteryLevel}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
