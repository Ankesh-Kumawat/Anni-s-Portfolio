import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Plus, Trash2, Upload, Loader2, Check, X } from "lucide-react";
import type { StepProps } from "../../types";
import { uploadToCloudinary, uploadAudioToCloudinary } from "@/lib/cloudinary";

interface PendingSong {
    id: string;
    file: File;
    title: string;
    artist: string;
    duration: string;
    coverUrl: string;
    coverBlob?: string;
}

export default function Step8Music({ data, setData }: StepProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, percentage: 0, fileName: "" });
    const [pendingSongs, setPendingSongs] = useState<PendingSong[]>([]);
    const [extractingMetadata, setExtractingMetadata] = useState(false);

    // Extract metadata from audio files
    const extractMetadata = (file: File): Promise<PendingSong> => {
        return new Promise((resolve) => {
            const audio = new Audio();
            const url = URL.createObjectURL(file);
            
            audio.addEventListener('loadedmetadata', async () => {
                const duration = Math.floor(audio.duration);
                const mins = Math.floor(duration / 60);
                const secs = duration % 60;
                const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;

                // Try to extract cover art from audio file
                let coverBlob = '';
                try {
                    const jsmediatags = (window as any).jsmediatags;
                    if (jsmediatags) {
                        await new Promise<void>((resolveTags) => {
                            jsmediatags.read(file, {
                                onSuccess: (tag: any) => {
                                    const { title, artist, picture } = tag.tags;
                                    
                                    // Extract cover image if available
                                    if (picture) {
                                        const { data, format } = picture;
                                        let base64String = "";
                                        for (let i = 0; i < data.length; i++) {
                                            base64String += String.fromCharCode(data[i]);
                                        }
                                        coverBlob = `data:${format};base64,${window.btoa(base64String)}`;
                                    }
                                    
                                    resolve({
                                        id: `pending-${Date.now()}-${Math.random()}`,
                                        file,
                                        title: title || file.name.replace(/\.[^/.]+$/, ""),
                                        artist: artist || "Unknown Artist",
                                        duration: durationStr,
                                        coverUrl: "",
                                        coverBlob
                                    });
                                    resolveTags();
                                },
                                onError: () => {
                                    resolve({
                                        id: `pending-${Date.now()}-${Math.random()}`,
                                        file,
                                        title: file.name.replace(/\.[^/.]+$/, ""),
                                        artist: "Unknown Artist",
                                        duration: durationStr,
                                        coverUrl: "",
                                        coverBlob: ""
                                    });
                                    resolveTags();
                                }
                            });
                        });
                    } else {
                        resolve({
                            id: `pending-${Date.now()}-${Math.random()}`,
                            file,
                            title: file.name.replace(/\.[^/.]+$/, ""),
                            artist: "Unknown Artist",
                            duration: durationStr,
                            coverUrl: "",
                            coverBlob: ""
                        });
                    }
                } catch (error) {
                    resolve({
                        id: `pending-${Date.now()}-${Math.random()}`,
                        file,
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        artist: "Unknown Artist",
                        duration: durationStr,
                        coverUrl: "",
                        coverBlob: ""
                    });
                }
                
                URL.revokeObjectURL(url);
            });

            audio.addEventListener('error', () => {
                URL.revokeObjectURL(url);
                resolve({
                    id: `pending-${Date.now()}-${Math.random()}`,
                    file,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: "Unknown Artist",
                    duration: "0:00",
                    coverUrl: "",
                    coverBlob: ""
                });
            });

            audio.src = url;
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const audioFiles = files.filter(file => file.type.startsWith('audio/'));
        if (audioFiles.length === 0) {
            alert("Please select audio files only!");
            return;
        }

        setExtractingMetadata(true);
        
        const extractedSongs: PendingSong[] = [];
        for (const file of audioFiles) {
            const songData = await extractMetadata(file);
            extractedSongs.push(songData);
        }

        setPendingSongs(prev => [...prev, ...extractedSongs]);
        setExtractingMetadata(false);
        e.target.value = '';
    };

    const handleUploadAll = async () => {
        if (pendingSongs.length === 0) return;

        try {
            setUploading(true);
            setUploadProgress({ current: 0, total: pendingSongs.length, percentage: 0, fileName: "" });

            const uploadedSongs: Array<{
                id: string;
                title: string;
                artist: string;
                audioUrl: string;
                coverUrl: string;
                duration: string;
            }> = [];

            for (let i = 0; i < pendingSongs.length; i++) {
                const song = pendingSongs[i];
                
                setUploadProgress({ 
                    current: i + 1, 
                    total: pendingSongs.length, 
                    percentage: 0,
                    fileName: song.title
                });

                // Upload audio to Cloudinary
                const audioUrl = await uploadAudioToCloudinary(song.file, (progress) => {
                    setUploadProgress({ 
                        current: i + 1, 
                        total: pendingSongs.length, 
                        percentage: progress,
                        fileName: song.title
                    });
                });

                // Upload cover if exists
                let coverUrl = song.coverUrl;
                if (song.coverBlob && !coverUrl) {
                    try {
                        const blob = await fetch(song.coverBlob).then(r => r.blob());
                        const coverFile = new File([blob], `${song.title}-cover.jpg`, { type: 'image/jpeg' });
                        coverUrl = await uploadToCloudinary(coverFile);
                    } catch (error) {
                        console.error("Failed to upload cover:", error);
                    }
                }

                uploadedSongs.push({
                    id: `song-${Date.now()}-${i}`,
                    title: song.title,
                    artist: song.artist,
                    audioUrl: audioUrl,
                    coverUrl: coverUrl,
                    duration: song.duration
                });
            }

            setData(prev => ({
                ...prev,
                music: {
                    songs: [...prev.music.songs, ...uploadedSongs]
                }
            }));

            setPendingSongs([]);

        } catch (error) {
            console.error("Error uploading songs:", error);
            alert("Failed to upload some songs. Please try again.");
        } finally {
            setUploading(false);
            setUploadProgress({ current: 0, total: 0, percentage: 0, fileName: "" });
        }
    };

    const updatePendingSong = (id: string, field: string, value: string) => {
        setPendingSongs(prev => prev.map(song =>
            song.id === id ? { ...song, [field]: value } : song
        ));
    };

    const removePendingSong = (id: string) => {
        setPendingSongs(prev => prev.filter(song => song.id !== id));
    };

    const handleCoverUploadPending = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const coverUrl = await uploadToCloudinary(file);
            updatePendingSong(id, "coverUrl", coverUrl);
        } catch (error) {
            console.error("Error uploading cover:", error);
            alert("Failed to upload cover image.");
        }
    };

    const updateSong = (index: number, field: string, value: string) => {
        setData(prev => ({
            ...prev,
            music: {
                songs: prev.music.songs.map((song, i) =>
                    i === index ? { ...song, [field]: value } : song
                )
            }
        }));
    };

    const removeSong = (index: number) => {
        setData(prev => ({
            ...prev,
            music: {
                songs: prev.music.songs.filter((_, i) => i !== index)
            }
        }));
    };

    const handleCoverUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const coverUrl = await uploadToCloudinary(file);
            updateSong(index, "coverUrl", coverUrl);
        } catch (error) {
            console.error("Error uploading cover:", error);
            alert("Failed to upload cover image.");
        }
    };

    const completionPercentage = () => {
        if (data.music.songs.length === 0) return 0;
        const totalFields = data.music.songs.length * 5;
        const filledFields = data.music.songs.reduce((acc, song) => {
            let count = 0;
            if (song.title) count++;
            if (song.artist) count++;
            if (song.audioUrl) count++;
            if (song.coverUrl) count++;
            if (song.duration) count++;
            return acc + count;
        }, 0);
        return Math.round((filledFields / totalFields) * 100);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Music Library</h2>
                        <p className="text-muted-foreground text-lg">Upload songs for X-Audio player</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Uploaded</div>
                            <div className="text-2xl font-bold text-primary">{data.music.songs.length}</div>
                        </div>
                        <Music className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Info Notice */}
            <div className="mb-8 p-6 bg-card border-2 border-primary/30 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <p className="text-base font-bold text-foreground">Music Player with Metadata Extraction</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Select audio files to extract metadata (title, artist, duration, cover art), preview them, then upload to Cloudinary.
                    </p>
                </div>
            </div>

            {/* Select Files Section */}
            <div className="mb-8 bg-card rounded-2xl p-6 border-2 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Select Songs</h3>
                            <p className="text-sm text-muted-foreground">
                                {pendingSongs.length > 0 
                                    ? `${pendingSongs.length} song${pendingSongs.length !== 1 ? 's' : ''} ready to upload`
                                    : "Choose audio files to extract metadata"
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <label>
                            <input
                                type="file"
                                multiple
                                accept="audio/*"
                                onChange={handleFileSelect}
                                disabled={extractingMetadata || uploading}
                                className="hidden"
                            />
                            <Button 
                                type="button" 
                                size="lg" 
                                variant="outline"
                                className="gap-2 px-6" 
                                disabled={extractingMetadata || uploading} 
                                asChild
                            >
                                <span>
                                    {extractingMetadata ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Extracting...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Select Files
                                        </>
                                    )}
                                </span>
                            </Button>
                        </label>
                        {pendingSongs.length > 0 && (
                            <Button 
                                type="button" 
                                size="lg" 
                                className="gap-2 px-6"
                                onClick={handleUploadAll}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload All ({pendingSongs.length})
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Upload Progress */}
                {uploading && (
                    <div className="mt-6 space-y-4 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-6 border-2 border-primary/20">
                        {/* Current Song Info */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-primary">{uploadProgress.current}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-bold text-foreground truncate pr-2">
                                        {uploadProgress.fileName}
                                    </p>
                                    <span className="text-lg font-bold text-primary tabular-nums">
                                        {uploadProgress.percentage}%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Uploading song {uploadProgress.current} of {uploadProgress.total}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-300 ease-out relative"
                                    style={{ width: `${uploadProgress.percentage}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                                         style={{ 
                                             backgroundSize: '200% 100%',
                                             animation: 'shimmer 2s infinite'
                                         }}
                                    />
                                </div>
                            </div>
                            {/* Percentage Markers */}
                            <div className="flex justify-between mt-1 px-1">
                                <span className="text-[10px] text-muted-foreground">0%</span>
                                <span className="text-[10px] text-muted-foreground">50%</span>
                                <span className="text-[10px] text-muted-foreground">100%</span>
                            </div>
                        </div>

                        {/* Upload Stats */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-muted-foreground">Uploading to Cloudinary</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Music className="w-3 h-3" />
                                <span>{uploadProgress.total - uploadProgress.current} remaining</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Pending Songs Preview */}
            {pendingSongs.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Music className="w-5 h-5 text-primary" />
                        Preview & Edit Before Upload
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {pendingSongs.map((song) => (
                            <div key={song.id} className="group bg-gradient-to-br from-card to-card/50 rounded-2xl p-4 border-2 border-border hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300">
                                {/* Cover Image */}
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20 mb-3 shadow-md">
                                    {song.coverUrl || song.coverBlob ? (
                                        <img 
                                            src={song.coverUrl || song.coverBlob} 
                                            alt={song.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Music className="w-12 h-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center gap-2">
                                        <Upload className="w-6 h-6 text-white" />
                                        <span className="text-xs text-white font-medium">Upload Cover</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleCoverUploadPending(song.id, e)}
                                            className="hidden"
                                        />
                                    </label>
                                    
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removePendingSong(song.id)}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Song Info */}
                                <div className="space-y-2">
                                    <Input
                                        value={song.title}
                                        onChange={(e) => updatePendingSong(song.id, "title", e.target.value)}
                                        placeholder="Song title"
                                        className="font-semibold text-sm h-9 bg-background/50"
                                    />
                                    <Input
                                        value={song.artist}
                                        onChange={(e) => updatePendingSong(song.id, "artist", e.target.value)}
                                        placeholder="Artist name"
                                        className="text-xs h-8 bg-background/50"
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-lg flex-1">
                                            <Music className="w-3 h-3 text-primary" />
                                            <Input
                                                value={song.duration}
                                                onChange={(e) => updatePendingSong(song.id, "duration", e.target.value)}
                                                placeholder="0:00"
                                                className="text-xs h-6 border-0 bg-transparent p-0 font-mono font-semibold"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground truncate" title={song.file.name}>
                                        {song.file.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Uploaded Songs List */}
            {data.music.songs.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        Uploaded Songs ({data.music.songs.length})
                    </h3>
                    <div className="space-y-4">
                        {data.music.songs.map((song, index) => (
                            <div key={song.id} className="bg-card rounded-xl p-6 border-2 shadow-sm">
                                <div className="flex items-start gap-4">
                                    {/* Cover Image */}
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        {song.coverUrl ? (
                                            <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Music className="w-8 h-8 text-muted-foreground/40" />
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleCoverUpload(index, e)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Song Details */}
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Song Title</label>
                                                <Input
                                                    value={song.title}
                                                    onChange={(e) => updateSong(index, "title", e.target.value)}
                                                    placeholder="Enter song title"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Artist</label>
                                                <Input
                                                    value={song.artist}
                                                    onChange={(e) => updateSong(index, "artist", e.target.value)}
                                                    placeholder="Enter artist name"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration</label>
                                                <Input
                                                    value={song.duration}
                                                    onChange={(e) => updateSong(index, "duration", e.target.value)}
                                                    placeholder="e.g., 3:45"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Audio URL</label>
                                                <Input
                                                    value={song.audioUrl}
                                                    readOnly
                                                    className="bg-muted text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeSong(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {data.music.songs.length === 0 && pendingSongs.length === 0 && (
                <div className="bg-card rounded-2xl p-12 border-2 border-dashed text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Music className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">No songs yet</h4>
                    <p className="text-muted-foreground mb-6">Select audio files to extract metadata and preview before uploading</p>
                </div>
            )}
        </div>
    );
}
