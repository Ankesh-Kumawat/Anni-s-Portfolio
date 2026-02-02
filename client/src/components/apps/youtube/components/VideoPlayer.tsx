import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeVideo, YouTubeChannel } from "../hooks/useYouTubeData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoPlayerProps {
    video: YouTubeVideo;
    channel: YouTubeChannel | null;
    relatedVideos: YouTubeVideo[];
    onVideoSelect: (video: YouTubeVideo) => void;
    onClose: () => void;
}

export function VideoPlayer({ video, channel, relatedVideos, onVideoSelect, onClose }: VideoPlayerProps) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    return (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background">
            {/* Mobile Layout - Video Fixed at Top */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Video Player - Fixed at top on mobile */}
                <div className="w-full bg-black aspect-video flex-shrink-0 sticky top-0 z-10 lg:relative">
                    <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Scrollable Content - Video Info + Related Videos on Mobile */}
                <ScrollArea className="flex-1">
                    <div className="lg:p-4 space-y-4">
                        {/* Video Info Section - Compact Mobile */}
                        <div className="p-3 lg:p-0 space-y-2 lg:space-y-4 border-b lg:border-b-0 pb-3 lg:pb-4">
                            {/* Title - Compact */}
                            <h1 className="text-base lg:text-xl font-bold leading-tight">{video.title}</h1>

                            {/* Views & Date - Mobile Compact */}
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground lg:hidden">
                                <span>{video.views} views</span>
                                <span>•</span>
                                <span>{video.publishedAt}</span>
                            </div>

                            {/* Channel Info & Subscribe - Compact */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {channel && (
                                        <>
                                            <img 
                                                src={channel.logo} 
                                                alt={channel.name}
                                                className="w-9 h-9 rounded-full flex-shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-sm truncate">{channel.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{channel.subscribers} subscribers</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {channel && (
                                    <Button
                                        onClick={() => setIsSubscribed(!isSubscribed)}
                                        size="sm"
                                        className={`rounded-full px-4 h-8 text-xs font-semibold flex-shrink-0 ${
                                            isSubscribed 
                                                ? "bg-muted text-foreground hover:bg-muted/80" 
                                                : "bg-foreground text-background hover:bg-foreground/90"
                                        }`}
                                    >
                                        {isSubscribed ? "Subscribed" : "Subscribe"}
                                    </Button>
                                )}
                            </div>

                            {/* Action Buttons - Compact Horizontal Scroll */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                                <div className="flex items-center bg-muted rounded-full flex-shrink-0">
                                    <Button variant="ghost" size="sm" className="rounded-l-full h-8 px-3">
                                        <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                                        <span className="text-xs font-semibold">{video.likeCount}</span>
                                    </Button>
                                    <div className="w-px h-5 bg-border" />
                                    <Button variant="ghost" size="sm" className="rounded-r-full h-8 px-3">
                                        <ThumbsDown className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="rounded-full bg-muted flex-shrink-0 h-8 px-3">
                                    <Share2 className="w-3.5 h-3.5 mr-1" />
                                    <span className="text-xs font-semibold">Share</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="rounded-full bg-muted flex-shrink-0 h-8 px-2 lg:hidden">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="rounded-full bg-muted flex-shrink-0 h-8 px-3 hidden lg:flex">
                                    <Download className="w-3.5 h-3.5 mr-1" />
                                    <span className="text-xs font-semibold">Download</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="rounded-full bg-muted flex-shrink-0 h-8 px-2 hidden lg:flex">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Description - Desktop Only */}
                            <div className="bg-muted rounded-xl p-3 hidden lg:block">
                                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                                    <span>{video.views} views</span>
                                    <span>•</span>
                                    <span>{video.publishedAt}</span>
                                </div>
                                <div className={`text-sm ${!showFullDescription && 'line-clamp-3'}`}>
                                    {video.description || "No description available"}
                                </div>
                                <button
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-sm font-semibold mt-2 flex items-center gap-1 hover:text-primary"
                                >
                                    {showFullDescription ? (
                                        <>Show less <ChevronUp className="w-4 h-4" /></>
                                    ) : (
                                        <>Show more <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>

                            {/* Comments Section - Desktop Only */}
                            <div className="border-t pt-4 hidden lg:block">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="font-semibold">{video.commentCount} Comments</span>
                                </div>
                                <div className="text-sm text-muted-foreground text-center py-8">
                                    Comments are disabled for embedded videos
                                </div>
                            </div>
                        </div>

                        {/* Related Videos - Mobile: Below video info, Desktop: Sidebar */}
                        <div className="lg:hidden px-3 pb-20 space-y-2">
                            <h3 className="font-semibold text-sm mb-2">Related Videos</h3>
                            {relatedVideos.slice(0, 20).map((relatedVideo) => (
                                <div
                                    key={relatedVideo.id}
                                    onClick={() => onVideoSelect(relatedVideo)}
                                    className="flex gap-2 cursor-pointer hover:bg-muted p-1.5 rounded-lg transition-colors active:scale-95"
                                >
                                    <div className="relative w-36 aspect-video rounded-md overflow-hidden bg-muted flex-shrink-0">
                                        <img 
                                            src={relatedVideo.thumbnail} 
                                            alt={relatedVideo.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute bottom-1 right-1 bg-black/90 text-white text-[10px] px-1 py-0.5 rounded font-semibold">
                                            {relatedVideo.duration}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold line-clamp-2 mb-0.5 leading-tight">
                                            {relatedVideo.title}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground truncate">{relatedVideo.channelTitle}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {relatedVideo.views} views • {relatedVideo.publishedAt}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Related Videos Sidebar - Desktop Only */}
            <div className="hidden lg:block w-96 border-l">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-3">
                        <h3 className="font-semibold mb-3">Related Videos</h3>
                        {relatedVideos.slice(0, 20).map((relatedVideo) => (
                            <div
                                key={relatedVideo.id}
                                onClick={() => onVideoSelect(relatedVideo)}
                                className="flex gap-2 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                            >
                                <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <img 
                                        src={relatedVideo.thumbnail} 
                                        alt={relatedVideo.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                        {relatedVideo.duration}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold line-clamp-2 mb-1">
                                        {relatedVideo.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">{relatedVideo.channelTitle}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {relatedVideo.views} views • {relatedVideo.publishedAt}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
