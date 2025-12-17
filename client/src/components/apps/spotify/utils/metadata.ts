import * as mm from "music-metadata";
import { Song } from "../types";

// Extract metadata from audio file using music-metadata
export async function extractMetadataFromFile(audioUrl: string): Promise<Partial<Song>> {
    try {
        // Fetch the audio file as a blob
        const response = await fetch(audioUrl);
        const blob = await response.blob();

        // Parse metadata
        const metadata = await mm.parseBlob(blob);
        const result: Partial<Song> = {};

        // Extract title
        if (metadata.common.title) {
            result.title = metadata.common.title;
        }

        // Extract artist
        if (metadata.common.artist) {
            result.artist = metadata.common.artist;
        }

        // Extract album
        if (metadata.common.album) {
            result.album = metadata.common.album;
        }

        // Extract album art
        if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            const uint8Array = new Uint8Array(picture.data);
            let binary = '';
            for (let i = 0; i < uint8Array.length; i++) {
                binary += String.fromCharCode(uint8Array[i]);
            }
            const base64 = btoa(binary);
            result.coverUrl = `data:${picture.format};base64,${base64}`;
        }

        return result;
    } catch (error) {
        console.warn("Failed to read metadata:", error);
        return {};
    }
}

// Extract metadata from filename as fallback
// Format: "Title by Artist - ID.m4a"
export function extractMetadataFromFilename(filename: string): Partial<Song> {
    // Remove extension
    const nameWithoutExt = filename.replace(/\.(m4a|mp3|wav|ogg)$/i, '');

    // Try to parse "Title by Artist - ID" format
    const byMatch = nameWithoutExt.match(/^(.+?)\s+by\s+(.+?)\s+-\s+(.+)$/);

    if (byMatch) {
        const [, title, artist] = byMatch;
        // Clean title: remove extra info in parentheses, brackets, and after pipes
        let cleanTitle = title.trim()
            .replace(/\s*\(Official.*?\)/gi, '')  // Remove (Official Music Video), etc.
            .replace(/\s*\[.*?\]/g, '')            // Remove [anything]
            .replace(/\s*\|.*$/g, '')              // Remove | and everything after
            .replace(/\s*_.*$/g, '')               // Remove _ and everything after
            .replace(/\s+/g, ' ')                  // Normalize spaces
            .trim();

        return {
            title: cleanTitle,
            artist: artist.trim(),
            album: "Singles",
        };
    }

    // Fallback: use filename as title (cleaned)
    let cleanTitle = nameWithoutExt
        .replace(/\s*\(Official.*?\)/gi, '')
        .replace(/\s*\[.*?\]/g, '')
        .replace(/\s*\|.*$/g, '')
        .replace(/\s*_.*$/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return {
        title: cleanTitle,
        artist: "Unknown Artist",
        album: "Singles",
    };
}

// Generate cover URL based on index (fallback)
export function generateCoverUrl(index: number): string {
    const covers = [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600",
    ];
    return covers[index % covers.length];
}

// Format duration from seconds to MM:SS
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Get audio duration
export function getAudioDuration(audioUrl: string): Promise<number> {
    return new Promise((resolve) => {
        const audio = new Audio(audioUrl);
        audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
        });
        audio.addEventListener('error', () => {
            resolve(0);
        });
    });
}

// List of all music files in /public/music/ folder
const musicFiles = [
    "4U.m4a",
    "Apna Bana Le.m4a",
    "AUR - ME.m4a",
    "AUR - YOU.m4a",
    "Bye.m4a",
    "Chalo Door Kahin.m4a",
    "Pasoori.m4a",
    "Dil Tu Jaan Tu.m4a",
    "Finding Her.m4a",
    "Kabhi Kabhi.m4a",
    "Kya Chahiye.m4a",
    "Kya Karoon.m4a",
    "Love Again.m4a",
    "Main Kho Gaya.m4a",
    "Maiyya Mainu.m4a",
    "Meri Banogi Kya.m4a",
    "Paaro.m4a",
    "Phool.m4a",
    "Raaz.m4a",
    "Sahiba.m4a",
    "Socha Na Tha.m4a",
    "Suniyan Suniyan.m4a",
    "Sunn Le Jaane Ja.m4a",
    "Tara.m4a",
    "Tumhare Aane Se.m4a",
    "Ve Haaniyaan.m4a",
    "Woh.m4a",
];

// Load a single song with metadata
async function loadSongMetadata(filename: string, index: number): Promise<Song> {
    const audioUrl = `/music/${filename}`;

    // Extract metadata from filename first (fallback)
    const filenameMetadata = extractMetadataFromFilename(filename);

    // Try to extract metadata from file
    const fileMetadata = await extractMetadataFromFile(audioUrl);

    // Get audio duration
    const durationSeconds = await getAudioDuration(audioUrl);
    const duration = formatDuration(durationSeconds);

    // Use filename for title only, use file metadata for artist, album, and cover art
    return {
        id: (index + 1).toString(),
        title: filenameMetadata.title || "Unknown Title",
        artist: fileMetadata.artist || filenameMetadata.artist || "Unknown Artist",
        album: fileMetadata.album || filenameMetadata.album || "Singles",
        duration: duration || "0:00",
        coverUrl: fileMetadata.coverUrl || generateCoverUrl(index),
        audioUrl: audioUrl,
    };
}

// Auto-generate songs from music folder files with metadata extraction
// Progressive loading: Load one by one and show immediately
export async function generateSongsFromFolder(
    onProgress?: (songs: Song[], loadedCount: number, totalCount: number) => void
): Promise<Song[]> {
    const songs: Song[] = [];
    const totalCount = musicFiles.length;

    // Load songs one by one
    for (let i = 0; i < musicFiles.length; i++) {
        const song = await loadSongMetadata(musicFiles[i], i);
        songs.push(song);

        // Notify progress after each song
        if (onProgress) {
            onProgress([...songs], i + 1, totalCount);
        }
    }

    return songs;
}
