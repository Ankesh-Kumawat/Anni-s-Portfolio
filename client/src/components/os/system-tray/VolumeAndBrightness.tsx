import { Monitor, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VolumeAndBrightnessProps {
    volume: number[];
    brightness: number[];
    onVolumeChange: (value: number[]) => void;
    onBrightnessChange: (value: number[]) => void;
}

export function VolumeAndBrightness({
    volume,
    brightness,
    onVolumeChange,
    onBrightnessChange,
}: VolumeAndBrightnessProps) {
    return (
        <div className="space-y-4 bg-muted/30 p-4 rounded-xl border">
            <div className="text-xs font-semibold text-muted-foreground mb-3">App Controls</div>
            <div className="space-y-4">
                {/* Brightness Control */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs">Brightness</span>
                        </div>
                        <span className="text-xs font-medium">{brightness[0]}%</span>
                    </div>
                    <Slider
                        value={brightness}
                        onValueChange={onBrightnessChange}
                        max={100}
                        step={1}
                        className="flex-1"
                    />
                    <p className="text-[10px] text-muted-foreground">App-level brightness filter</p>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs">Volume</span>
                        </div>
                        <span className="text-xs font-medium">{volume[0]}%</span>
                    </div>
                    <Slider
                        value={volume}
                        onValueChange={onVolumeChange}
                        max={100}
                        step={1}
                        className="flex-1"
                    />
                    <p className="text-[10px] text-muted-foreground">Controls in-app audio only</p>
                </div>
            </div>
        </div>
    );
}
