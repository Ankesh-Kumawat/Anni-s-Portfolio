import { DevTunesWidget } from "./DevTunesWidget";
import { SplitFlapClock } from "./SplitFlapClock";
import { SystemStatus } from "./SystemStatus";
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
        <div className="hidden md:block absolute top-20 right-6 w-[360px] space-y-3 pointer-events-none [&>*]:pointer-events-auto z-0">
            {/* Split-Flap Clock - Desktop only */}
            <SplitFlapClock />

            {/* System Status Widget */}
            <SystemStatus />

            {/* DevTunes Widget - Only show when song is playing or paused */}
            {spotifyData?.currentSong && (
                <DevTunesWidget
                    currentSong={spotifyData.currentSong}
                    isPlaying={spotifyData.isPlaying}
                    onTogglePlay={spotifyData.onTogglePlay}
                    onNext={spotifyData.onNext}
                    onPrevious={spotifyData.onPrevious}
                    onOpenApp={() => launchApp('spotify')}
                />
            )}
        </div>
    );
}
