import { XAudioWidget } from "./XAudioWidget";
import { SplitFlapClock } from "./SplitFlapClock";
import { useOS } from "@/lib/os-context";

interface WidgetsPanelProps {
  spotifyData?: {
    currentSong: {
      title: string;
      artist: string;
      coverUrl: string;
    } | null;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrevious: () => void;
  };
}

export function WidgetsPanel({ spotifyData }: WidgetsPanelProps) {
  const { launchApp } = useOS();

  return (
    <div className="hidden md:block absolute top-13 right-6 w-[350px] space-y-3.5 pointer-events-none [&>*]:pointer-events-auto z-0">
      {/* Split-Flap Clock - Desktop only */}
      <SplitFlapClock />

      {/* X-Audio Widget - Only show when song is playing or paused */}
      {spotifyData?.currentSong && (
        <XAudioWidget
          currentSong={spotifyData.currentSong}
          isPlaying={spotifyData.isPlaying}
          onTogglePlay={spotifyData.onTogglePlay}
          onNext={spotifyData.onNext}
          onPrevious={spotifyData.onPrevious}
          onOpenApp={() => launchApp("spotify")}
        />
      )}
    </div>
  );
}
