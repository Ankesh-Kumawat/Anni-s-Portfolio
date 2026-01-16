import { useState, useEffect } from "react";
import { getYouTubeData } from "@/lib/firebase-service";

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    publishedAt: string;
    channelTitle: string;
    description: string;
}

export interface YouTubeChannel {
    name: string;
    logo: string;
    subscribers: string;
    videoCount: string;
}

export function useYouTubeData() {
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [shorts, setShorts] = useState<YouTubeVideo[]>([]);
    const [channel, setChannel] = useState<YouTubeChannel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadYouTubeData();
    }, []);

    const loadYouTubeData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get YouTube config from Firebase
            const config = await getYouTubeData();

            if (!config || !config.apiKey || !config.channelId) {
                setError("YouTube not configured. Please set up in editor.");
                setLoading(false);
                return;
            }

            // Fetch channel info
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${config.channelId}&key=${config.apiKey}`
            );
            const channelData = await channelResponse.json();

            if (channelData.error) {
                setError(channelData.error.message);
                setLoading(false);
                return;
            }

            if (channelData.items && channelData.items.length > 0) {
                const ch = channelData.items[0];
                setChannel({
                    name: ch.snippet.title,
                    logo: ch.snippet.thumbnails.default.url,
                    subscribers: formatNumber(ch.statistics.subscriberCount),
                    videoCount: ch.statistics.videoCount
                });
            }

            // Fetch videos from channel
            const uploadsResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${config.channelId}&maxResults=50&order=date&type=video&key=${config.apiKey}`
            );
            const uploadsData = await uploadsResponse.json();

            if (uploadsData.error) {
                setError(uploadsData.error.message);
                setLoading(false);
                return;
            }

            if (uploadsData.items) {
                // Get video IDs to fetch durations
                const videoIds = uploadsData.items.map((item: any) => item.id.videoId).join(',');
                
                const videosResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${config.apiKey}`
                );
                const videosData = await videosResponse.json();

                const videosMap = new Map();
                if (videosData.items) {
                    videosData.items.forEach((video: any) => {
                        videosMap.set(video.id, {
                            duration: formatDuration(video.contentDetails.duration),
                            views: formatNumber(video.statistics.viewCount)
                        });
                    });
                }

                // Separate shorts and regular videos
                const allVideos: YouTubeVideo[] = uploadsData.items.map((item: any) => {
                    const videoDetails = videosMap.get(item.id.videoId) || { duration: "0:00", views: "0" };
                    return {
                        id: item.id.videoId,
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
                        duration: videoDetails.duration,
                        views: videoDetails.views,
                        publishedAt: formatTimeAgo(item.snippet.publishedAt),
                        channelTitle: item.snippet.channelTitle,
                        description: item.snippet.description
                    };
                });

                // Filter shorts (videos under 60 seconds)
                const shortsList = allVideos.filter(v => {
                    const [mins, secs] = v.duration.split(':').map(Number);
                    return mins === 0 && secs <= 60;
                });

                const regularVideos = allVideos.filter(v => {
                    const [mins, secs] = v.duration.split(':').map(Number);
                    return mins > 0 || secs > 60;
                });

                setShorts(shortsList);
                setVideos(regularVideos);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error loading YouTube data:", err);
            setError("Failed to load YouTube data");
            setLoading(false);
        }
    };

    return { videos, shorts, channel, loading, error, refresh: loadYouTubeData };
}

// Helper functions
function formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatNumber(num: string | number): string {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) {
        return (n / 1000000).toFixed(1) + 'M';
    }
    if (n >= 1000) {
        return (n / 1000).toFixed(1) + 'K';
    }
    return n.toString();
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}
