import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Upload, Loader2, Trash2, X, Plus } from "lucide-react";
import type { StepProps } from "../../types";
import SectionCard from "../../components/SectionCard";
import { uploadAudioToCloudinary, uploadToCloudinary } from "@/lib/cloudinary";

interface PendingSong {
    id: string;
    file: File;
    title: string;
    artist: string;
    duration: string;
    coverBlob?: string;
    coverUrl?: string;
}

export default function MusicPage({ data, setData }: StepProps) {
    const [pendingSongs, setPendingSongs] = useState<PendingSong[]>([]);
    const [extracting, setExtracting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });

    const extractMetadata = (file: File): Promise<PendingSong> => {
        return new Promise((resolve) => {
            const audio = new Audio();
            const url = URL.createObjectURL(file);
            audio.src = url;

            audio.onloadedmetadata = () => {
                const duration = Number.isFinite(audio.duration) ? Math.floor(audio.duration) : 0;
                URL.revokeObjectURL(url);
                resolve({
                    id: `pending-${Date.now()}-${Math.random()}`,
                    file,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: "Unknown Artist",
                    duration: `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`,
                });
            };

            audio.onerror = () => {
                URL.revokeObjectURL(url);
                resolve({
                    id: `pending-${Date.now()}-${Math.random()}`,
                    file,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: "Unknown Artist",
                    duration: "0:00",
                });
            };
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith("audio/"));
        if (files.length === 0) return;
        setExtracting(true);
        const songs = [];
        for (const file of files) songs.push(await extractMetadata(file));
        setPendingSongs((prev) => [...prev, ...songs]);
        setExtracting(false);
        e.target.value = "";
    };

    const updatePendingSong = (id: string, field: keyof PendingSong, value: string) => {
        setPendingSongs((prev) => prev.map((song) => (song.id === id ? { ...song, [field]: value } : song)));
    };

    const removePendingSong = (id: string) => {
        setPendingSongs((prev) => prev.filter((song) => song.id !== id));
    };

    const handlePendingCover = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const coverUrl = await uploadToCloudinary(file);
        updatePendingSong(id, "coverUrl", coverUrl);
    };

    const handleUploadAll = async () => {
        if (pendingSongs.length === 0) return;
        setUploading(true);
        const uploaded = [];
        for (let i = 0; i < pendingSongs.length; i++) {
            const song = pendingSongs[i];
            setProgress({ current: i + 1, total: pendingSongs.length, label: song.title });
            const audioUrl = await uploadAudioToCloudinary(song.file);
            uploaded.push({
                id: `song-${Date.now()}-${i}`,
                title: song.title,
                artist: song.artist,
                audioUrl,
                coverUrl: song.coverUrl || "",
                duration: song.duration,
            });
        }
        setData((prev) => ({ ...prev, music: { songs: [...prev.music.songs, ...uploaded] } }));
        setPendingSongs([]);
        setProgress({ current: 0, total: 0, label: "" });
        setUploading(false);
    };

    const updateSong = (index: number, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            music: {
                songs: prev.music.songs.map((song, i) => (i === index ? { ...song, [field]: value } : song)),
            },
        }));
    };

    const removeSong = (index: number) => {
        setData((prev) => ({ ...prev, music: { songs: prev.music.songs.filter((_, i) => i !== index) } }));
    };

    const handleCoverUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const coverUrl = await uploadToCloudinary(file);
        updateSong(index, "coverUrl", coverUrl);
    };

    return (
        <div className="editor-page-grid two editor-music-page">
            <div className="editor-page-main">
                <SectionCard
                    title="Saved Library"
                    eyebrow={`${data.music.songs.length} songs saved`}
                    description="Main music catalog used by the Spotify app."
                    icon={Music}
                >
                    {data.music.songs.length > 0 ? (
                        <div className="editor-saved-song-grid">
                            {data.music.songs.map((song, index) => (
                                <SavedSongRow
                                    key={song.id}
                                    song={song}
                                    index={index}
                                    onChange={updateSong}
                                    onRemove={removeSong}
                                    onCover={handleCoverUpload}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="editor-empty-state min-h-[360px]">
                            <div className="editor-work-icon"><Music className="h-5 w-5" /></div>
                            <h4>No songs saved</h4>
                            <p>Uploaded songs will appear in the main library here.</p>
                        </div>
                    )}
                </SectionCard>
            </div>

            <div className="editor-page-side">
                <SectionCard
                    title="Selected Files"
                    eyebrow={`${pendingSongs.length} ready`}
                    description="Small upload queue for new songs."
                    icon={Upload}
                    aside={
                        <label>
                            <input type="file" accept="audio/*" multiple onChange={handleFileSelect} disabled={extracting || uploading} className="hidden" />
                            <Button variant="outline" size="sm" asChild>
                                <span>{extracting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Select</span>
                            </Button>
                        </label>
                    }
                >
                    {uploading && (
                        <div className="editor-upload-strip">
                            <span>{progress.current}/{progress.total}</span>
                            <strong>{progress.label}</strong>
                        </div>
                    )}

                    {pendingSongs.length > 0 ? (
                        <>
                            <div className="editor-selected-song-list">
                                {pendingSongs.map((song) => (
                                    <SongDraftCard
                                        key={song.id}
                                        song={song}
                                        onChange={updatePendingSong}
                                        onRemove={removePendingSong}
                                        onCover={handlePendingCover}
                                    />
                                ))}
                            </div>
                            <Button onClick={handleUploadAll} disabled={uploading} size="sm" className="w-full mt-3 gap-1.5">
                                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                                Upload Selected
                            </Button>
                        </>
                    ) : (
                        <div className="editor-empty-state min-h-[180px]">
                            <h4>No files selected</h4>
                            <p>Select songs to prepare uploads.</p>
                        </div>
                    )}
                </SectionCard>
            </div>
        </div>
    );
}

function SongDraftCard({ song, onChange, onRemove, onCover }: {
    song: PendingSong;
    onChange: (id: string, field: keyof PendingSong, value: string) => void;
    onRemove: (id: string) => void;
    onCover: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="editor-song-card">
            <CoverBox url={song.coverUrl} onCover={(e) => onCover(song.id, e)} />
            <div className="editor-song-fields">
                <Input value={song.title} onChange={(e) => onChange(song.id, "title", e.target.value)} placeholder="Title" />
                <Input value={song.artist} onChange={(e) => onChange(song.id, "artist", e.target.value)} placeholder="Artist" />
                <Input value={song.duration} onChange={(e) => onChange(song.id, "duration", e.target.value)} placeholder="0:00" />
            </div>
            <button type="button" onClick={() => onRemove(song.id)} className="editor-song-remove"><X className="h-4 w-4" /></button>
        </div>
    );
}

function SavedSongRow({ song, index, onChange, onRemove, onCover }: {
    song: any;
    index: number;
    onChange: (index: number, field: string, value: string) => void;
    onRemove: (index: number) => void;
    onCover: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="editor-saved-song">
            <CoverBox url={song.coverUrl} onCover={(e) => onCover(index, e)} />
            <div className="min-w-0 space-y-2">
                <Input value={song.title} onChange={(e) => onChange(index, "title", e.target.value)} />
                <div className="grid grid-cols-[1fr_70px] gap-2">
                    <Input value={song.artist} onChange={(e) => onChange(index, "artist", e.target.value)} />
                    <Input value={song.duration} onChange={(e) => onChange(index, "duration", e.target.value)} />
                </div>
            </div>
            <button type="button" onClick={() => onRemove(index)} className="editor-song-remove"><Trash2 className="h-4 w-4" /></button>
        </div>
    );
}

function CoverBox({ url, onCover }: { url?: string; onCover: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <label className="editor-cover-box">
            {url ? <img src={url} alt="Cover" /> : <Music className="h-5 w-5" />}
            <input type="file" accept="image/*" onChange={onCover} className="hidden" />
        </label>
    );
}
