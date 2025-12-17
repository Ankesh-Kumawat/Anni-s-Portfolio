import { Battery, Volume2, BatteryCharging } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FocusModeToggle } from "./FocusModeToggle.tsx";
import { VolumeAndBrightness } from "./VolumeAndBrightness.tsx";
import { StatusInfo } from "./StatusInfo.tsx";

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
                            <span className="text-xs tabular-nums">{batteryLevel}%</span>
                        )}
                        {isCharging ? (
                            <BatteryCharging className="w-4 h-4 text-green-500" />
                        ) : (
                            <Battery className="w-4 h-4" />
                        )}
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-screen md:w-80 p-4 mr-0 md:mr-4 mt-0 md:mt-2 bg-background/95 backdrop-blur-xl shadow-2xl rounded-b-2xl md:rounded-2xl border-t-0 md:border-t transition-all duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-top-4 data-[state=closed]:slide-out-to-top-4 md:data-[state=open]:slide-in-from-top-0 md:data-[state=closed]:slide-out-to-top-0"
                align="center"
                side="bottom"
                sideOffset={0}
                alignOffset={0}
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
