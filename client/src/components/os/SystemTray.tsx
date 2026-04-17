import { useState, useEffect } from "react";
import { format } from "date-fns";
import { HelpCircle } from "lucide-react";
import { useOS } from "@/lib/os-context";
import { useVolume } from "@/lib/volume-context";
import { useBrightness } from "@/lib/brightness-context";
import { ControlCenterPopover } from "./system-tray/ControlCenterPopover";
import { ZoomIndicator } from "./system-tray/ZoomIndicator";

export function SystemTray() {
  const { launchApp } = useOS();
  const [time, setTime] = useState(new Date());
  const { volume, setVolume } = useVolume();
  const { brightness, setBrightness } = useBrightness();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect browser zoom level (read-only)
  useEffect(() => {
    const detectZoom = () => {
      const zoom = Math.round((window.outerWidth / window.innerWidth) * 100);
      setZoomLevel(zoom);
    };

    detectZoom();
    window.addEventListener('resize', detectZoom);

    return () => {
      window.removeEventListener('resize', detectZoom);
    };
  }, []);

  // Battery API (read-only)
  useEffect(() => {
    const getBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
          });
        } catch (error) {
          console.log('Battery API not supported');
        }
      }
    };

    getBatteryInfo();
  }, []);



  return (
    <div className="h-11 px-4 md:px-6 flex items-center justify-between text-sm font-medium text-foreground bg-background/80 backdrop-blur-md border-b border-border/40 select-none shadow-sm z-[200] relative">
      <div className="flex items-center gap-6">
        <span className="font-bold text-foreground tracking-tight">OS</span>
        <button
          onClick={() => launchApp('terminal')}
          className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Help</span>
        </button>

        {/* Hide zoom on mobile, show on desktop */}
        <div className="hidden md:block">
          <ZoomIndicator zoomLevel={zoomLevel} />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ControlCenterPopover
          volume={[volume * 100]}
          brightness={brightness}
          zoomLevel={zoomLevel}
          batteryLevel={batteryLevel}
          isCharging={isCharging}
          onVolumeChange={(val) => setVolume(val[0] / 100)}
          onBrightnessChange={setBrightness}
        />

        {/* Date Time */}
        <span className="tabular-nums text-[13px] md:text-sm font-medium hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-full cursor-default transition-all border border-transparent hover:border-white/10">
          {format(time, "EEE MMM d h:mm aa")}
        </span>
      </div>
    </div>
  );
}
