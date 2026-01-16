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
            {/* Main Video Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Video Player */}
                <div className="w-full bg-black aspect-video flex-shrink-0">
                    <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Video Info */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {/* Title */}
                        <h1 className="text-xl font-bold">{video.title}</h1>

                        {/* Channel Info & Actions */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                {channel && (
                                    <>
                                        <img 
                                            src={channel.logo} 
                                            alt={channel.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-semibold">{channel.name}</p>
                                            <p className="text-xs text-muted-foreground">{channel.subscribers} subscribers</p>
                                        </div>
                                        <Button
                                            onClick={() => setIsSubscribed(!isSubscribed)}
                                            className={`ml-2 rounded-full ${
                                                isSubscribed 
                                                    ? "bg-muted text-foreground hover:bg-muted/80" 
                                                    : "bg-foreground text-background hover:bg-foreground/90"
                                            }`}
                                        >
                                            {isSubscribed ? "Subscribed" : "Subscribe"}
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-muted rounded-full">
                                    <Button variant="ghost" size="sm" className="rounded-l-full">
                                        <ThumbsUp className="w-4 h-4 mr-2" />
                                        {video.likeCount}
                                    </Button>
                                    <div className="w-px h-6 bg-border" />
                                    <Button variant="ghost" size="sm" className="rounded-r-full">
                                        <ThumbsDown className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="rounded-full bg-muted">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="ghost" size="sm" className="rounded-full bg-muted">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full bg-muted">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-muted rounded-xl p-3">
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

                        {/* Comments Section */}
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="font-semibold">{video.commentCount} Comments</span>
                            </div>
                            <div className="text-sm text-muted-foreground text-center py-8">
                                Comments are disabled for embedded videos
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Related Videos Sidebar */}
            <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l">
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
