import React from "react";
import { Volume2, VolumeX, Sun } from "lucide-react";
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
  const roundedVolume = Math.round(volume[0] || 0);
  const roundedBrightness = Math.round(brightness[0] || 100);
  const isMuted = roundedVolume === 0;
  const previousVolumeRef = React.useRef<number>(70);

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange([previousVolumeRef.current || 70]);
    } else {
      previousVolumeRef.current = roundedVolume;
      onVolumeChange([0]);
    }
  };

  return (
    <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/90 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
      {/* Brightness Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-300">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Display Brightness</span>
          </div>
          <span className="font-semibold tabular-nums text-zinc-500 dark:text-zinc-400 text-xs">
            {roundedBrightness}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Slider
            value={[roundedBrightness]}
            onValueChange={(val) => onBrightnessChange([Math.round(val[0])])}
            min={20}
            max={100}
            step={1}
            className={cn(
              "flex-1 cursor-pointer",
              "[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-amber-400 [&_[role=slider]]:shadow-md",
              "[&_.relative]:h-2 [&_.relative]:bg-zinc-200 dark:[&_.relative]:bg-zinc-800 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-amber-500 [&_.bg-primary]:to-yellow-400"
            )}
          />
        </div>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-300">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">System Sound</span>
          </div>
          <span className="font-semibold tabular-nums text-zinc-500 dark:text-zinc-400 text-xs">
            {isMuted ? "Muted" : `${roundedVolume}%`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Slider
            value={[roundedVolume]}
            onValueChange={(val) => onVolumeChange([Math.round(val[0])])}
            min={0}
            max={100}
            step={1}
            className={cn(
              "flex-1 cursor-pointer",
              "[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:shadow-md",
              "[&_.relative]:h-2 [&_.relative]:bg-zinc-200 dark:[&_.relative]:bg-zinc-800 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-blue-500 [&_.bg-primary]:to-cyan-400"
            )}
          />
        </div>
      </div>
    </div>
  );
}
