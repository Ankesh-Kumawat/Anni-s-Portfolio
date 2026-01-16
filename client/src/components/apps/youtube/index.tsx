import { useState } from "react";
import { YouTubeHeader } from "./components/YouTubeHeader";
import { Sidebar } from "./components/Sidebar";
import { VideoGrid } from "./components/VideoGrid";
import { VideoPlayer } from "./components/VideoPlayer";
import { ChannelProfile } from "./components/ChannelProfile";
import { Home, Grid, Video, Library, Loader2, AlertCircle, User } from "lucide-react";
import { useYouTubeData, YouTubeVideo } from "./hooks/useYouTubeData";

type ViewMode = "home" | "shorts" | "video" | "profile";

export default function YouTube() {
    const [viewMode, setViewMode] = useState<ViewMode>("home");
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
    const { videos, shorts, playlists, channel, loading, error, searchVideos } = useYouTubeData();

    const handleVideoSelect = (video: YouTubeVideo) => {
        setSelectedVideo(video);
        setViewMode("video");
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = await searchVideos(query);
            setSearchResults(results);
            setViewMode("home");
        } else {
            setSearchResults([]);
        }
    };

    const handleProfileClick = () => {
        setViewMode("profile");
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleHomeClick = () => {
        setViewMode("home");
        setSelectedVideo(null);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleShortsClick = () => {
        setViewMode("shorts");
        setSelectedVideo(null);
        setSearchQuery("");
        setSearchResults([]);
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-background overflow-hidden">
                <YouTubeHeader 
                    channel={channel} 
                    onSearch={handleSearch}
                    onProfileClick={handleProfileClick}
                />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Loading YouTube data...</p>
                        <p className="text-xs text-muted-foreground mt-1">Fetching all videos from channel</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full bg-background overflow-hidden">
                <YouTubeHeader 
                    channel={channel} 
                    onSearch={handleSearch}
                    onProfileClick={handleProfileClick}
                />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">YouTube Not Configured</h3>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <p className="text-xs text-muted-foreground">
                            Please configure YouTube API in the editor settings (Step 8).
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const displayVideos = searchQuery ? searchResults : (viewMode === "shorts" ? shorts : videos);

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <YouTubeHeader 
                channel={channel} 
                onSearch={handleSearch}
                onProfileClick={handleProfileClick}
                searchQuery={searchQuery}
            />

            {viewMode === "video" && selectedVideo ? (
                <VideoPlayer
                    video={selectedVideo}
                    channel={channel}
                    relatedVideos={videos}
                    onVideoSelect={handleVideoSelect}
                    onClose={handleHomeClick}
                />
            ) : viewMode === "profile" && channel ? (
                <ChannelProfile
                    channel={channel}
                    videos={videos}
                    shorts={shorts}
                    playlists={playlists}
                    onVideoSelect={handleVideoSelect}
                    onClose={handleHomeClick}
                />
            ) : (
                <div className="flex-1 flex overflow-hidden">
                    <Sidebar 
                        activeTab={viewMode === "shorts" ? "shorts" : "home"} 
                        onTabChange={(tab) => tab === "shorts" ? handleShortsClick() : handleHomeClick()}
                        videosCount={videos.length}
                        shortsCount={shorts.length}
                        onProfileClick={handleProfileClick}
                    />
                    <VideoGrid 
                        videos={displayVideos} 
                        isShorts={viewMode === "shorts"}
                        onVideoSelect={handleVideoSelect}
                        searchQuery={searchQuery}
                    />
                </div>
            )}

            {/* Mobile Bottom Nav */}
            <div className="md:hidden h-12 bg-background border-t flex items-center justify-around z-20 shrink-0">
                <button 
                    onClick={handleHomeClick}
                    className={viewMode === "home" ? "text-foreground" : "text-muted-foreground"}
                >
                    <Home className="w-6 h-6" />
                </button>
                <button 
                    onClick={handleShortsClick}
                    className={viewMode === "shorts" ? "text-foreground" : "text-muted-foreground"}
                >
                    <Grid className="w-6 h-6" />
                </button>
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <Video className="w-6 h-6 text-muted-foreground" />
                <button 
                    onClick={handleProfileClick}
                    className={viewMode === "profile" ? "text-foreground" : "text-muted-foreground"}
                >
                    <User className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
