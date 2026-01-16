import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { YouTubeChannel, YouTubeVideo, YouTubePlaylist } from "../hooks/useYouTubeData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChannelProfileProps {
    channel: YouTubeChannel;
    videos: YouTubeVideo[];
    shorts: YouTubeVideo[];
    playlists: YouTubePlaylist[];
    onVideoSelect: (video: YouTubeVideo) => void;
    onClose: () => void;
}

export function ChannelProfile({ channel, videos, shorts, playlists, onVideoSelect, onClose }: ChannelProfileProps) {
    const [activeTab, setActiveTab] = useState<"home" | "videos" | "shorts" | "playlists" | "about">("home");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const tabs = [
        { id: "home", label: "Home" },
        { id: "videos", label: "Videos", count: videos.length },
        { id: "shorts", label: "Shorts", count: shorts.length },
        { id: "playlists", label: "Playlists", count: playlists.length },
        { id: "about", label: "About" },
    ];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Compact Channel Header */}
            <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center gap-4">
                    <img 
                        src={channel.logo} 
                        alt={channel.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl md:text-2xl font-bold truncate">{channel.name}</h1>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground flex-wrap">
                            <span>{channel.customUrl}</span>
                            <span>•</span>
                            <span>{channel.subscribers} subscribers</span>
                            <span>•</span>
                            <span>{channel.videoCount} videos</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Button
                                onClick={() => setIsSubscribed(!isSubscribed)}
                                size="sm"
                                className={`rounded-full ${
                                    isSubscribed 
                                        ? "bg-muted text-foreground hover:bg-muted/80" 
                                        : "bg-foreground text-background hover:bg-foreground/90"
                                }`}
                            >
                                {isSubscribed ? "Subscribed" : "Subscribe"}
                            </Button>
                            {isSubscribed && (
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                    <Bell className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b flex-shrink-0">
                <div className="flex items-center gap-4 md:gap-6 px-4 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-2 px-1 border-b-2 transition-colors whitespace-nowrap text-sm ${
                                activeTab === tab.id
                                    ? "border-foreground font-semibold"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="ml-1 text-xs">({tab.count})</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-3 md:p-4">
                    {activeTab === "home" && (
                        <div className="space-y-6">
                            {/* Latest Videos Grid */}
                            {videos.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-bold mb-3">Latest Videos</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {videos.slice(0, 8).map((video) => (
                                            <div
                                                key={video.id}
                                                onClick={() => onVideoSelect(video)}
                                                className="cursor-pointer group"
                                            >
                                                <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2 relative">
                                                    <img 
                                                        src={video.thumbnail} 
                                                        alt={video.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                                        {video.duration}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold line-clamp-2 text-sm">{video.title}</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {video.views} views • {video.publishedAt}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "videos" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {videos.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => onVideoSelect(video)}
                                    className="cursor-pointer group"
                                >
                                    <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2 relative">
                                        <img 
                                            src={video.thumbnail} 
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                            {video.duration}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold line-clamp-2 text-sm">{video.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {video.views} views • {video.publishedAt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "shorts" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {shorts.map((short) => (
                                <div
                                    key={short.id}
                                    onClick={() => onVideoSelect(short)}
                                    className="cursor-pointer group"
                                >
                                    <div className="aspect-[9/16] rounded-lg overflow-hidden bg-muted mb-1 relative">
                                        <img 
                                            src={short.thumbnail} 
                                            alt={short.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                            {short.duration}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold line-clamp-2 text-xs">{short.title}</h3>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                        {short.views} views
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "playlists" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {playlists.map((playlist) => (
                                <div
                                    key={playlist.id}
                                    className="cursor-pointer group"
                                >
                                    <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2 relative">
                                        <img 
                                            src={playlist.thumbnail} 
                                            alt={playlist.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <p className="text-2xl font-bold">{playlist.videoCount}</p>
                                                <p className="text-xs">videos</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold line-clamp-2 text-sm">{playlist.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">View full playlist</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="max-w-2xl space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-sm">Description</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {channel.description}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-sm">Stats</h3>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subscribers</span>
                                        <span className="font-medium">{channel.subscribers}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Videos</span>
                                        <span className="font-medium">{channel.videoCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Channel</span>
                                        <span className="font-medium">{channel.customUrl}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
