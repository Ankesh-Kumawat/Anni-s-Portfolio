import { useState } from "react";
import { YouTubeHeader } from "./components/YouTubeHeader";
import { Sidebar } from "./components/Sidebar";
import { VideoGrid } from "./components/VideoGrid";
import { VideoPlayer } from "./components/VideoPlayer";
import { ChannelProfile } from "./components/ChannelProfile";
import { ShortsPlayer } from "./components/ShortsPlayer";
import { Home, Grid, Video, Loader2, AlertCircle, User } from "lucide-react";
import { useYouTubeData, YouTubeVideo } from "./hooks/useYouTubeData";

type ViewMode = "home" | "shorts" | "video" | "profile" | "shortsPlayer";

export default function YouTube() {
    const [viewMode, setViewMode] = useState<ViewMode>("home");
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
    const [selectedShortIndex, setSelectedShortIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
    const { videos, shorts, playlists, channel, loading, error, searchVideos } = useYouTubeData();

    const handleVideoSelect = (video: YouTubeVideo) => {
        // Check if it's a short
        const shortIndex = shorts.findIndex(s => s.id === video.id);
        if (shortIndex !== -1) {
            setSelectedShortIndex(shortIndex);
            setViewMode("shortsPlayer");
        } else {
            setSelectedVideo(video);
            setViewMode("video");
        }
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            console.log("Searching for:", query);
            const results = await searchVideos(query);
            console.log("Search results:", results.length);
            setSearchResults(results);
            setViewMode("home");
        } else {
            setSearchResults([]);
            setViewMode("home");
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

    const handleCloseShortsPlayer = () => {
        setViewMode("shorts");
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

    // Shorts Player Full Screen
    if (viewMode === "shortsPlayer") {
        return (
            <div className="relative h-full w-full overflow-hidden">
                <ShortsPlayer
                    shorts={shorts}
                    initialIndex={selectedShortIndex}
                    channel={channel}
                    onClose={handleCloseShortsPlayer}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden relative">
            <YouTubeHeader 
                channel={channel} 
                onSearch={handleSearch}
                onProfileClick={handleProfileClick}
                onBack={handleHomeClick}
                searchQuery={searchQuery}
                showBackButton={viewMode === "video" || viewMode === "profile"}
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
                        channel={channel}
                        isShorts={viewMode === "shorts"}
                        onVideoSelect={handleVideoSelect}
                        searchQuery={searchQuery}
                    />
                </div>
            )}

            {/* Mobile Bottom Nav - Ultra Modern & Unique */}
            <div className="md:hidden h-16 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-around z-20 shrink-0 px-4 relative">
                {/* Active indicator background glow */}
                <div className={`absolute bottom-2 h-12 rounded-2xl bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-500/20 blur-xl transition-all duration-500 ${
                    viewMode === "home" ? "left-4 w-24" : 
                    viewMode === "shorts" ? "left-1/2 -translate-x-1/2 w-24" : 
                    "right-4 w-28"
                }`} />
                
                <button 
                    onClick={handleHomeClick}
                    className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                        viewMode === "home" 
                            ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/40 scale-110 -translate-y-1" 
                            : "text-muted-foreground hover:bg-muted/50 hover:scale-105"
                    }`}
                >
                    <Home className={`${viewMode === "home" ? "w-5 h-5" : "w-5 h-5"} transition-all`} />
                    {viewMode === "home" && (
                        <span className="text-sm font-bold tracking-wide animate-in fade-in slide-in-from-left-3 duration-300">
                            Home
                        </span>
                    )}
                    {viewMode === "home" && (
                        <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
                    )}
                </button>
                
                <button 
                    onClick={handleShortsClick}
                    className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                        viewMode === "shorts" 
                            ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/40 scale-110 -translate-y-1" 
                            : "text-muted-foreground hover:bg-muted/50 hover:scale-105"
                    }`}
                >
                    <Video className={`${viewMode === "shorts" ? "w-5 h-5" : "w-5 h-5"} transition-all`} />
                    {viewMode === "shorts" && (
                        <span className="text-sm font-bold tracking-wide animate-in fade-in slide-in-from-left-3 duration-300">
                            Shorts
                        </span>
                    )}
                    {viewMode === "shorts" && (
                        <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
                    )}
                </button>
                
                <button 
                    onClick={handleProfileClick}
                    className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                        viewMode === "profile" 
                            ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/40 scale-110 -translate-y-1" 
                            : "text-muted-foreground hover:bg-muted/50 hover:scale-105"
                    }`}
                >
                    {channel ? (
                        <img 
                            src={channel.logo} 
                            alt={channel.name}
                            className={`w-5 h-5 rounded-full transition-all ${
                                viewMode === "profile" ? "ring-2 ring-white shadow-lg" : ""
                            }`}
                        />
                    ) : (
                        <User className={`${viewMode === "profile" ? "w-5 h-5" : "w-5 h-5"} transition-all`} />
                    )}
                    {viewMode === "profile" && (
                        <span className="text-sm font-bold tracking-wide animate-in fade-in slide-in-from-left-3 duration-300">
                            Channel
                        </span>
                    )}
                    {viewMode === "profile" && (
                        <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
                    )}
                </button>
            </div>
        </div>
    );
}
