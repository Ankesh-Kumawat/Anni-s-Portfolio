export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    coverUrl: string;
    audioUrl: string;
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    songs: Song[];
}
