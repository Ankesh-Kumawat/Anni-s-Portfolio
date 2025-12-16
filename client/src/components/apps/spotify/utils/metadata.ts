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
        return {
            title: title.trim(),
            artist: artist.trim(),
            album: "Singles",
        };
    }

    // Fallback: use filename as title
    return {
        title: nameWithoutExt,
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
    "4U by Maanu - UO_QEkZtMAw.m4a",
    "Apna Bana Le by Arijit Singh - ElZfdU54Cp8.m4a",
    "AUR - ME (Official Lyrical Video) by AUR - X6GeSTxnB3Y.m4a",
    "AUR - YOU (Official Lyrical Video) by AUR - jYXN8xd_OPc.m4a",
    "Bye by Aditya Bhardwaj - DbiRVNeZPnw.m4a",
    "Chalo Door Kahin by Samar Jafri - piyLXuSrDYo.m4a",
    "Coke Studio _ Season 14 _ Pasoori _ Ali Sethi x Shae Gill by Coke Studio Pakistan - 5Eqb_-j3FDA.m4a",
    "Darmiyaan Mashup 2024 - Shafqat Amanat Ali, Armaan Malik, Yasser - Sad Chillout  - BICKY OFFICIAL by BICKY OFFICIAL - DTNtQ-FkA-4.m4a",
    "Dil Tu Jaan Tu by Gurnazar Chattha - kyjg5kX4pT0.m4a",
    "Finding Her (Female Version) by Tanishka Bahl, Kushagra, Bharath, Saaheal - 6VKrB1PYsS8.m4a",
    "Kabhi Kabhi by AUR _ کبھی کبھی  (Official Visualizer) by AUR - yLAcnCtvsJU.m4a",
    "Kya Chahiye by AUR _ کیا چاہیے  (Official Music Video) by AUR - -qLQ10H9gfA.m4a",
    "kya karoon_ by Zaeden - v4peso5bOY8.m4a",
    "Love Again Song _ 1Min Music _ Sanju Rathod & Nilima Chavhan by Anant Ghule Official - xVl3U75C-Lc.m4a",
    "Main Kho Gaya (Visualiser) by Kushagra, Showkidd - MldmN-0b9j4.m4a",
    "Maiyya Mainu by Sachet-Parampara - 3zFgrvoE.m4a",
    "Meri Banogi Kya by Rito Riba, Rajat Nagpal - uoLC9u_M-E8.m4a",
    "Paaro by Aditya Rikhari - DxsDekHDKXo.m4a",
    "Phool by AUR _ پھول by AUR - cKjxvTMAvpI.m4a",
    "Raaz by Zaeden - 6Cfd3EOvHzw.m4a",
    "Sahiba by Aditya Rikhari - n2dVFdqMYGA.m4a",
    "socha na tha by Zaeden - Cxg6xPmSFFU.m4a",
    "Suniyan Suniyan by Juss, MixSingh - AKH6ZNSnWOA.m4a",
    "Sunn Le Jaane Ja by Avinash Kumar, Abhishek Shukla, Aviverse - fJDpn251gbo.m4a",
    "Tara by Deepak Rathore Project - B3LyKf21ibo.m4a",
    "Tumhare Aane Se by Ashu Shukla - FzjorhJJwuA.m4a",
    "Ve Haaniyaan (feat. Avvy Sra) by Danny - E_SbwSe15y0.m4a",
    "Woh by Khatth, Sthiti - G8nlhcmDXNE.m4a",
];

// Auto-generate songs from music folder files with metadata extraction
export async function generateSongsFromFolder(): Promise<Song[]> {
    const songs: Song[] = [];

    for (let i = 0; i < musicFiles.length; i++) {
        const filename = musicFiles[i];
        const audioUrl = `/music/${filename}`;

        // Extract metadata from filename first (fallback)
        const filenameMetadata = extractMetadataFromFilename(filename);

        // Try to extract metadata from file
        const fileMetadata = await extractMetadataFromFile(audioUrl);

        // Get audio duration
        const durationSeconds = await getAudioDuration(audioUrl);
        const duration = formatDuration(durationSeconds);

        // Merge metadata (file metadata takes priority)
        const song: Song = {
            id: (i + 1).toString(),
            title: fileMetadata.title || filenameMetadata.title || "Unknown Title",
            artist: fileMetadata.artist || filenameMetadata.artist || "Unknown Artist",
            album: fileMetadata.album || filenameMetadata.album || "Singles",
            duration: duration || "0:00",
            coverUrl: fileMetadata.coverUrl || generateCoverUrl(i),
            audioUrl: audioUrl,
        };

        songs.push(song);
    }

    return songs;
}
