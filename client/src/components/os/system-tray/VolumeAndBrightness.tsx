import { Volume2, Sun } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

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
        <div className="space-y-6 bg-white/5 p-5 rounded-2xl border border-white/5">
            <div className="space-y-5">
                {/* Brightness Control */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-500">
                                <Sun className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">Brightness</span>
                        </div>
                        <span className="text-[10px] font-bold tabular-nums text-white/50">{brightness[0]}%</span>
                    </div>
                    <Slider
                        value={brightness}
                        onValueChange={onBrightnessChange}
                        max={100}
                        step={1}
                        className={cn(
                            "flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-primary",
                            "[&_.relative]:h-1.5 [&_.bg-primary]:bg-yellow-500"
                        )}
                    />
                </div>

                {/* Volume Control */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-500">
                                <Volume2 className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">Volume</span>
                        </div>
                        <span className="text-[10px] font-bold tabular-nums text-white/50">{volume[0]}%</span>
                    </div>
                    <Slider
                        value={volume}
                        onValueChange={onVolumeChange}
                        max={100}
                        step={1}
                        className={cn(
                            "flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-primary",
                            "[&_.relative]:h-1.5 [&_.bg-primary]:bg-blue-500"
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
