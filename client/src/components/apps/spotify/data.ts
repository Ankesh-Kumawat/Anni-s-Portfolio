import { Song, Playlist } from "./types";
import { getMusicData } from "@/lib/firebase-service";

// Songs loaded from Firebase
export let songs: Song[] = [];

// Initialize songs from Firebase
let songsInitialized = false;
export async function initializeSongs(
    onProgress?: (songs: Song[], loadedCount: number, totalCount: number) => void
): Promise<Song[]> {
    if (songsInitialized && songs.length > 0) {
        return songs;
    }

    try {
        const musicData = await getMusicData();
        
        if (musicData && musicData.songs && Array.isArray(musicData.songs)) {
            songs = musicData.songs;
            songsInitialized = true;
            
            if (onProgress) {
                onProgress(songs, songs.length, songs.length);
            }
            
            console.log(`✅ Loaded ${songs.length} songs from Firebase`);
        } else {
            console.log("No songs found in Firebase");
            songs = [];
        }
    } catch (error) {
        console.error("Failed to load songs from Firebase:", error);
        songs = [];
    }

    return songs;
}

export const playlists: Playlist[] = [
    {
        id: "main",
        name: "My Music Collection",
        description: "Your personal music library with amazing tracks",
        coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600",
        songs: songs,
    },
];

// Helper function to format duration
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
