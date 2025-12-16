import { SpotifyWidget } from "./SpotifyWidget";
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

    // Only show widgets panel if there's content to display
    const hasContent = spotifyData && spotifyData.currentSong;

    if (!hasContent) {
        return null;
    }

    return (
        <div className="absolute top-20 right-6 w-80 space-y-4 pointer-events-none [&>*]:pointer-events-auto z-20">
            {/* Spotify Widget - Only show when song is playing or paused */}
            {spotifyData.currentSong && (
                <SpotifyWidget
                    currentSong={spotifyData.currentSong}
                    isPlaying={spotifyData.isPlaying}
                    onTogglePlay={spotifyData.onTogglePlay}
                    onNext={spotifyData.onNext}
                    onPrevious={spotifyData.onPrevious}
                    onOpenApp={() => launchApp('spotify')}
                />
            )}

            {/* Add more widgets here in future */}
        </div>
    );
}
