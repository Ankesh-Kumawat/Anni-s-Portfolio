import { useState, useEffect } from "react";
import { format } from "date-fns";
import { HelpCircle } from "lucide-react";
import { useOS } from "@/lib/os-context";
import { ControlCenterPopover } from "./system-tray/ControlCenterPopover";
import { ZoomIndicator } from "./system-tray/ZoomIndicator";

export function SystemTray() {
  const { launchApp } = useOS();
  const [time, setTime] = useState(new Date());
  const [volume, setVolume] = useState([75]);
  const [brightness, setBrightness] = useState([100]);
  const [focusMode, setFocusMode] = useState(false);
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

  // Apply app-level brightness using CSS filter
  useEffect(() => {
    const brightnessValue = brightness[0] / 100;
    document.documentElement.style.filter = `brightness(${brightnessValue})`;

    return () => {
      document.documentElement.style.filter = '';
    };
  }, [brightness]);

  return (
    <div className="h-10 px-4 md:px-6 flex items-center justify-between text-sm font-medium text-muted-foreground bg-background border-b select-none shadow-sm z-50 relative">
      <div className="flex items-center gap-6">
        <span className="font-bold text-foreground tracking-tight">OS</span>
        <button
          onClick={() => launchApp('terminal')}
          className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Help</span>
        </button>

        <ZoomIndicator zoomLevel={zoomLevel} />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ControlCenterPopover
          volume={volume}
          brightness={brightness}
          focusMode={focusMode}
          zoomLevel={zoomLevel}
          batteryLevel={batteryLevel}
          isCharging={isCharging}
          onVolumeChange={setVolume}
          onBrightnessChange={setBrightness}
          onFocusModeToggle={() => setFocusMode(!focusMode)}
        />

        {/* Date Time */}
        <span className="tabular-nums text-xs md:text-sm font-medium hover:bg-muted/50 px-2 py-1 rounded-md cursor-default transition-colors">
          {format(time, "EEE MMM d h:mm aa")}
        </span>
      </div>
    </div>
  );
}
