# Music Folder

Add your MP3 or M4A music files here to play them in the Spotify app.

## How to Add Songs:

1. Copy your music files (MP3, M4A) to this folder: `client/public/music/`
2. Update the song list in: `client/src/components/apps/spotify/data.ts`

## Example:

```typescript
export const songs: Song[] = [
  {
    id: "1",
    title: "Your Song Title",
    artist: "Artist Name",
    album: "Album Name",
    duration: "3:45",
    coverUrl: "https://your-cover-image-url.jpg",
    audioUrl: "/music/your-song.mp3",
  },
  // Add more songs...
];
```

## Supported Formats:
- MP3 (.mp3)
- M4A (.m4a)
- WAV (.wav)
- OGG (.ogg)

## Features:
- ✅ Play/Pause
- ✅ Next/Previous
- ✅ Progress bar with seek
- ✅ Volume control
- ✅ Auto-play next song
- ✅ Real-time progress tracking
