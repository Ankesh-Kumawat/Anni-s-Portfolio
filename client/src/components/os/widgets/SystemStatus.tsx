import { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  Wifi,
  Shield,
  Zap,
  Clock,
  Layers,
} from "lucide-react";
import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function SystemStatus() {
  const { openWindows } = useOS();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [uptime, setUptime] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  // Live CPU Simulation
  const [cpuUsage, setCpuUsage] = useState<number[]>([
    25, 40, 30, 55, 35, 60, 45, 50, 65, 30, 45, 40,
  ]);

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
      setCpuUsage((prev) => [
        ...prev.slice(1),
        Math.floor(Math.random() * 50) + 20,
      ]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getBattery = async () => {
      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
          battery.addEventListener("levelchange", () =>
            setBatteryLevel(Math.round(battery.level * 100))
          );
          battery.addEventListener("chargingchange", () =>
            setIsCharging(battery.charging)
          );
        } catch {}
      }
    };
    getBattery();
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentBat = batteryLevel ?? 98;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentBat / 100) * circumference;

  const currentCpu = cpuUsage[cpuUsage.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-3xl bg-white/90 dark:bg-zinc-950/90 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl p-5 backdrop-blur-xl transition-all duration-300 select-none hover:shadow-indigo-500/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              System Telemetry
            </h4>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              AniPlix OS v2.4 • Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Battery Circle Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xs">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="35"
                cy="35"
                r={radius}
                className={cn(
                  isCharging
                    ? "stroke-indigo-500"
                    : currentBat > 20
                    ? "stroke-emerald-500"
                    : "stroke-rose-500"
                )}
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                  transition: "stroke-dashoffset 0.8s ease-in-out",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {isCharging ? (
                <Zap className="w-3.5 h-3.5 text-indigo-500 animate-bounce" />
              ) : (
                <span className="text-[11px] font-mono font-black text-zinc-900 dark:text-zinc-100">
                  {currentBat}%
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Power
            </span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
              {isCharging ? "Charging" : `${currentBat}% Left`}
            </span>
            <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
              {isCharging ? "AC Adapter" : "On Battery"}
            </span>
          </div>
        </div>

        {/* CPU & Memory Live Waveform */}
        <div className="p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                CPU Load
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {currentCpu}%
            </span>
          </div>

          {/* Equalizer Bars */}
          <div className="flex items-end gap-1 h-6 pt-1">
            {cpuUsage.map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-indigo-500 dark:bg-indigo-400 rounded-xs transition-all duration-300"
                style={{ height: `${Math.max(15, val)}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info Row */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 grid grid-cols-2 gap-2 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
              Uptime
            </span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {formatUptime(uptime)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
              Running Procs
            </span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {openWindows.length} Active
            </span>
          </div>
          <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
