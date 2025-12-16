import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Battery, Wifi, Volume2, Bluetooth, Moon, Monitor, HelpCircle, ZoomIn } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useOS } from "@/lib/os-context";

export function SystemTray() {
  const { launchApp } = useOS();
  const [time, setTime] = useState(new Date());
  const [volume, setVolume] = useState([75]);
  const [brightness, setBrightness] = useState([100]);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect browser zoom level
  useEffect(() => {
    const detectZoom = () => {
      const zoom = Math.round((window.devicePixelRatio || 1) * 100);
      setZoomLevel(zoom);
    };

    detectZoom();
    window.addEventListener('resize', detectZoom);

    // Also listen for zoom changes via visualViewport
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', detectZoom);
    }

    return () => {
      window.removeEventListener('resize', detectZoom);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', detectZoom);
      }
    };
  }, []);

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

        {/* Zoom Level Indicator */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors",
            zoomLevel !== 100 ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" : "text-muted-foreground"
          )}
          title={`Browser zoom: ${zoomLevel}% (Recommended: 100%)`}
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{zoomLevel}%</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Control Center Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-muted/50 px-2 py-1 rounded-md transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1">
              <Wifi className="w-4 h-4" />
              <Volume2 className="w-4 h-4" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs hidden sm:inline">100%</span>
                <Battery className="w-4 h-4" />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 mr-4 mt-2 bg-background/95 backdrop-blur-xl shadow-2xl rounded-2xl border" align="end" sideOffset={8}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Toggles Grid */}
              <div className="bg-muted/30 p-4 rounded-xl border flex flex-col gap-4 col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsWifiOn(!isWifiOn)}
                      className={cn("p-2 rounded-full transition-colors", isWifiOn ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground")}
                    >
                      <Wifi className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold">Wi-Fi</span>
                      <span className="text-[10px] text-muted-foreground">{isWifiOn ? "Connected" : "Off"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsBluetoothOn(!isBluetoothOn)}
                      className={cn("p-2 rounded-full transition-colors", isBluetoothOn ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground")}
                    >
                      <Bluetooth className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold">Bluetooth</span>
                      <span className="text-[10px] text-muted-foreground">{isBluetoothOn ? "On" : "Off"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-rows-2 gap-4 col-span-1">
                <div className="bg-muted/30 p-3 rounded-xl border flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-full bg-orange-400/20 text-orange-500">
                    <Moon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">Do Not Disturb</span>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-full bg-green-400/20 text-green-500">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">Screen Mirror</span>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 bg-muted/30 p-4 rounded-xl border mb-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <Slider value={brightness} onValueChange={setBrightness} max={100} step={1} className="flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Time */}
        <span className="tabular-nums text-xs md:text-sm font-medium hover:bg-muted/50 px-2 py-1 rounded-md cursor-default transition-colors">
          {format(time, "EEE MMM d h:mm aa")}
        </span>
      </div>
    </div>
  );
}
