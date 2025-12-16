import { Song, Playlist } from "./types";
import { generateSongsFromFolder } from "./utils/metadata";

// Auto-generated songs from /public/music/ folder with metadata extraction
// This will be populated on app load
export let songs: Song[] = [];

// Initialize songs with metadata (progressive loading)
let songsInitialized = false;
export async function initializeSongs(
    onProgress?: (songs: Song[], loadedCount: number, totalCount: number) => void
): Promise<Song[]> {
    if (songsInitialized && songs.length > 0) {
        return songs;
    }

    try {
        songs = await generateSongsFromFolder((loadedSongs, loadedCount, totalCount) => {
            songs = loadedSongs;
            if (onProgress) {
                onProgress(loadedSongs, loadedCount, totalCount);
            }
            if (loadedCount === totalCount) {
                songsInitialized = true;
                console.log(`✅ Loaded ${songs.length} songs with metadata`);
            }
        });
    } catch (error) {
        console.error("Failed to load songs:", error);
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
