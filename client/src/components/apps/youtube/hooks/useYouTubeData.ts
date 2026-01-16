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
    likeCount?: string;
    commentCount?: string;
}

export interface YouTubeChannel {
    id: string;
    name: string;
    logo: string;
    banner: string;
    subscribers: string;
    videoCount: string;
    description: string;
    customUrl: string;
}

export interface YouTubePlaylist {
    id: string;
    title: string;
    thumbnail: string;
    videoCount: number;
}

export function useYouTubeData() {
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [shorts, setShorts] = useState<YouTubeVideo[]>([]);
    const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
    const [channel, setChannel] = useState<YouTubeChannel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState("");
    const [channelId, setChannelId] = useState("");

    useEffect(() => {
        loadYouTubeData();
    }, []);

    const loadYouTubeData = async () => {
        try {
            setLoading(true);
            setError(null);

            const config = await getYouTubeData();

            if (!config || !config.apiKey || !config.channelId) {
                setError("YouTube not configured. Please set up in editor.");
                setLoading(false);
                return;
            }

            setApiKey(config.apiKey);
            setChannelId(config.channelId);

            // Fetch channel info with banner
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${config.channelId}&key=${config.apiKey}`
            );
            const channelData = await channelResponse.json();

            if (channelData.error) {
                setError(channelData.error.message);
                setLoading(false);
                return;
            }

            if (channelData.items && channelData.items.length > 0) {
                const ch = channelData.items[0];
                const channelLogo = ch.snippet.thumbnails.high?.url || 
                                   ch.snippet.thumbnails.medium?.url || 
                                   ch.snippet.thumbnails.default?.url || "";
                
                setChannel({
                    id: ch.id,
                    name: ch.snippet.title,
                    logo: channelLogo,
                    banner: ch.brandingSettings?.image?.bannerExternalUrl || "",
                    subscribers: formatNumber(ch.statistics.subscriberCount),
                    videoCount: ch.statistics.videoCount,
                    description: ch.snippet.description,
                    customUrl: ch.snippet.customUrl || `@${ch.snippet.title.replace(/\s+/g, '')}`
                });
            }

            // Fetch ALL videos (multiple pages)
            await fetchAllVideos(config.apiKey, config.channelId);

            // Fetch playlists
            await fetchPlaylists(config.apiKey, config.channelId);

            setLoading(false);
        } catch (err) {
            console.error("Error loading YouTube data:", err);
            setError("Failed to load YouTube data");
            setLoading(false);
        }
    };

    const fetchAllVideos = async (apiKey: string, channelId: string) => {
        let allVideos: YouTubeVideo[] = [];
        let nextPageToken = "";
        let pageCount = 0;
        const maxPages = 10; // Fetch up to 500 videos (50 per page)

        do {
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&pageToken=${nextPageToken}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.error || !data.items) break;

            const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
            
            const videosResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${apiKey}`
            );
            const videosData = await videosResponse.json();

            if (videosData.items) {
                const videos = videosData.items.map((video: any) => ({
                    id: video.id,
                    title: video.snippet.title,
                    thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url,
                    duration: formatDuration(video.contentDetails.duration),
                    views: formatNumber(video.statistics.viewCount),
                    publishedAt: formatTimeAgo(video.snippet.publishedAt),
                    channelTitle: video.snippet.channelTitle,
                    description: video.snippet.description,
                    likeCount: formatNumber(video.statistics.likeCount || 0),
                    commentCount: formatNumber(video.statistics.commentCount || 0)
                }));

                allVideos = [...allVideos, ...videos];
            }

            nextPageToken = data.nextPageToken || "";
            pageCount++;
        } while (nextPageToken && pageCount < maxPages);

        // Separate shorts and regular videos
        const shortsList = allVideos.filter(v => {
            const parts = v.duration.split(':');
            if (parts.length === 2) {
                const [mins, secs] = parts.map(Number);
                return mins === 0 && secs <= 60;
            }
            return false;
        });

        const regularVideos = allVideos.filter(v => {
            const parts = v.duration.split(':');
            if (parts.length === 2) {
                const [mins, secs] = parts.map(Number);
                return mins > 0 || secs > 60;
            }
            return true;
        });

        setShorts(shortsList);
        setVideos(regularVideos);
    };

    const fetchPlaylists = async (apiKey: string, channelId: string) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${apiKey}`
            );
            const data = await response.json();

            if (data.items) {
                const playlists = data.items.map((playlist: any) => ({
                    id: playlist.id,
                    title: playlist.snippet.title,
                    thumbnail: playlist.snippet.thumbnails.high?.url || playlist.snippet.thumbnails.medium.url,
                    videoCount: playlist.contentDetails.itemCount
                }));
                setPlaylists(playlists);
            }
        } catch (err) {
            console.error("Error fetching playlists:", err);
        }
    };

    const searchVideos = async (query: string): Promise<YouTubeVideo[]> => {
        if (!apiKey || !channelId || !query) return [];

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(query)}&maxResults=20&type=video&key=${apiKey}`
            );
            const data = await response.json();

            if (data.items) {
                const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
                const videosResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${apiKey}`
                );
                const videosData = await videosResponse.json();

                if (videosData.items) {
                    return videosData.items.map((video: any) => ({
                        id: video.id,
                        title: video.snippet.title,
                        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url,
                        duration: formatDuration(video.contentDetails.duration),
                        views: formatNumber(video.statistics.viewCount),
                        publishedAt: formatTimeAgo(video.snippet.publishedAt),
                        channelTitle: video.snippet.channelTitle,
                        description: video.snippet.description,
                        likeCount: formatNumber(video.statistics.likeCount || 0),
                        commentCount: formatNumber(video.statistics.commentCount || 0)
                    }));
                }
            }
        } catch (err) {
            console.error("Error searching videos:", err);
        }

        return [];
    };

    return { 
        videos, 
        shorts, 
        playlists,
        channel, 
        loading, 
        error, 
        refresh: loadYouTubeData,
        searchVideos
    };
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
    if (isNaN(n)) return '0';
    if (n >= 1000000) {
        return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    if (n >= 1000) {
        return (n / 1000).toFixed(1).replace('.0', '') + 'K';
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
