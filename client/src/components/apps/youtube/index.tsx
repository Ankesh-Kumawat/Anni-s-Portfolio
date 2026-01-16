import { useState } from "react";
import { YouTubeHeader } from "./components/YouTubeHeader";
import { Sidebar } from "./components/Sidebar";
import { VideoGrid } from "./components/VideoGrid";
import { Home, Grid, Video, Library, Loader2, AlertCircle } from "lucide-react";
import { useYouTubeData } from "./hooks/useYouTubeData";

export default function YouTube() {
    const [activeTab, setActiveTab] = useState<"home" | "shorts">("home");
    const { videos, shorts, channel, loading, error } = useYouTubeData();

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-background overflow-hidden">
                <YouTubeHeader channel={channel} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Loading videos...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full bg-background overflow-hidden">
                <YouTubeHeader channel={channel} />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">YouTube Not Configured</h3>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <p className="text-xs text-muted-foreground">
                            Please configure YouTube API in the editor settings.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <YouTubeHeader channel={channel} />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab}
                    videosCount={videos.length}
                    shortsCount={shorts.length}
                />
                <VideoGrid 
                    videos={activeTab === "home" ? videos : shorts} 
                    isShorts={activeTab === "shorts"}
                />
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden h-12 bg-background border-t flex items-center justify-around z-20 shrink-0">
                <button 
                    onClick={() => setActiveTab("home")}
                    className={activeTab === "home" ? "text-foreground" : "text-muted-foreground"}
                >
                    <Home className="w-6 h-6" />
                </button>
                <button 
                    onClick={() => setActiveTab("shorts")}
                    className={activeTab === "shorts" ? "text-foreground" : "text-muted-foreground"}
                >
                    <Grid className="w-6 h-6" />
                </button>
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <Video className="w-6 h-6 text-muted-foreground" />
                <Library className="w-6 h-6 text-muted-foreground" />
            </div>
        </div>
    );
}
