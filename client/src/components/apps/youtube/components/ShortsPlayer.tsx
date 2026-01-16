import { useState, useEffect, useRef } from "react";
import { X, ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreVertical, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { YouTubeVideo, YouTubeChannel } from "../hooks/useYouTubeData";
import { Button } from "@/components/ui/button";

interface ShortsPlayerProps {
    shorts: YouTubeVideo[];
    initialIndex: number;
    channel: YouTubeChannel | null;
    onClose: () => void;
}

export function ShortsPlayer({ shorts, initialIndex, channel, onClose }: ShortsPlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isMuted, setIsMuted] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentShort = shorts[currentIndex];
    const hasNext = currentIndex < shorts.length - 1;
    const hasPrevious = currentIndex > 0;

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default behavior for arrow keys
            if (["ArrowUp", "ArrowDown", "Escape"].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (e.key === "ArrowUp" && hasPrevious) {
                goToPrevious();
            } else if (e.key === "ArrowDown" && hasNext) {
                goToNext();
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown, { capture: true });
        return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, [currentIndex, hasNext, hasPrevious]);

    // Mouse wheel navigation with throttle
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (isScrolling) return; // Prevent multiple scrolls

            if (e.deltaY > 50 && hasNext) {
                setIsScrolling(true);
                goToNext();
                setTimeout(() => setIsScrolling(false), 800); // 800ms cooldown
            } else if (e.deltaY < -50 && hasPrevious) {
                setIsScrolling(true);
                goToPrevious();
                setTimeout(() => setIsScrolling(false), 800); // 800ms cooldown
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: true });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, [currentIndex, hasNext, hasPrevious, isScrolling]);

    const goToNext = () => {
        if (hasNext) {
            setCurrentIndex(prev => prev + 1);
            setIsLiked(false);
        }
    };

    const goToPrevious = () => {
        if (hasPrevious) {
            setCurrentIndex(prev => prev - 1);
            setIsLiked(false);
        }
    };

    return (
        <div 
            ref={containerRef}
            className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 z-50 flex items-center justify-center overflow-hidden"
        >
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/20 shadow-lg"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Main Content */}
            <div className="relative w-full h-full flex items-center justify-center z-10">
                {/* Video Player - Smaller Size */}
                <div className="relative w-[min(90vw,400px)] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl">
                    <iframe
                        src={`https://www.youtube.com/embed/${currentShort.id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&loop=1&playlist=${currentShort.id}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-16 p-4 text-white z-10">
                        {/* Channel Info */}
                        <div className="flex items-center gap-3 mb-3">
                            {channel && (
                                <>
                                    <img 
                                        src={channel.logo} 
                                        alt={channel.name}
                                        className="w-10 h-10 rounded-full border-2 border-white"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm">{channel.name}</p>
                                        <p className="text-xs text-white/80">{channel.subscribers} subscribers</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-white text-black hover:bg-white/90 rounded-full px-4 h-8"
                                    >
                                        Subscribe
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Title */}
                        <p className="text-sm font-medium line-clamp-2 mb-2">
                            {currentShort.title}
                        </p>

                        {/* Stats */}
                        <p className="text-xs text-white/70">
                            {currentShort.views} views
                        </p>
                    </div>

                    {/* Right Side Actions */}
                    <div className="absolute right-3 bottom-20 flex flex-col gap-6 z-10">
                        {/* Like */}
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className="flex flex-col items-center gap-1 text-white"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                isLiked ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
                            }`}>
                                <ThumbsUp className={`w-6 h-6 ${isLiked ? "fill-white" : ""}`} />
                            </div>
                            <span className="text-xs font-medium">{currentShort.likeCount}</span>
                        </button>

                        {/* Dislike */}
                        <button className="flex flex-col items-center gap-1 text-white">
                            <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                                <ThumbsDown className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium">Dislike</span>
                        </button>

                        {/* Comments */}
                        <button className="flex flex-col items-center gap-1 text-white">
                            <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium">{currentShort.commentCount}</span>
                        </button>

                        {/* Share */}
                        <button className="flex flex-col items-center gap-1 text-white">
                            <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium">Share</span>
                        </button>

                        {/* More */}
                        <button className="flex flex-col items-center gap-1 text-white">
                            <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                                <MoreVertical className="w-6 h-6" />
                            </div>
                        </button>

                        {/* Mute Toggle */}
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="flex flex-col items-center gap-1 text-white mt-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                                {isMuted ? (
                                    <VolumeX className="w-6 h-6" />
                                ) : (
                                    <Volume2 className="w-6 h-6" />
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    {hasPrevious && (
                        <button
                            onClick={goToPrevious}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[200%] w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all z-10"
                        >
                            <ChevronUp className="w-6 h-6" />
                        </button>
                    )}

                    {hasNext && (
                        <button
                            onClick={goToNext}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[200%] w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all z-10"
                        >
                            <ChevronDown className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-4 right-4 text-white text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg z-50">
                {currentIndex + 1} / {shorts.length}
            </div>
        </div>
    );
}
