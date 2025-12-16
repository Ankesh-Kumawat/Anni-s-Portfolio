import { Battery, Volume2, BatteryCharging } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FocusModeToggle } from "./FocusModeToggle";
import { VolumeAndBrightness } from "./VolumeAndBrightness";
import { StatusInfo } from "./StatusInfo";

interface ControlCenterPopoverProps {
    volume: number[];
    brightness: number[];
    focusMode: boolean;
    zoomLevel: number;
    batteryLevel: number | null;
    isCharging: boolean;
    onVolumeChange: (value: number[]) => void;
    onBrightnessChange: (value: number[]) => void;
    onFocusModeToggle: () => void;
}

export function ControlCenterPopover({
    volume,
    brightness,
    focusMode,
    zoomLevel,
    batteryLevel,
    isCharging,
    onVolumeChange,
    onBrightnessChange,
    onFocusModeToggle,
}: ControlCenterPopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-muted/50 px-2 py-1 rounded-md transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1">
                    <Volume2 className="w-4 h-4" />
                    <div className="flex items-center gap-1.5">
                        {batteryLevel !== null && (
                            <span className="text-xs hidden sm:inline">{batteryLevel}%</span>
                        )}
                        {isCharging ? (
                            <BatteryCharging className="w-4 h-4" />
                        ) : (
                            <Battery className="w-4 h-4" />
                        )}
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-4 mr-4 mt-2 bg-background/95 backdrop-blur-xl shadow-2xl rounded-2xl border"
                align="end"
                sideOffset={8}
            >
                <div className="space-y-4">
                    <FocusModeToggle focusMode={focusMode} onToggle={onFocusModeToggle} />

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
