import { Play, Pause } from "lucide-react";
import { Song } from "../types";

interface MainContentProps {
    songs: Song[];
    currentSong: Song | null;
    isPlaying: boolean;
    onPlaySong: (song: Song) => void;
    onTogglePlay: () => void;
}

export function MainContent({ songs, currentSong, isPlaying, onPlaySong, onTogglePlay }: MainContentProps) {
    const playlist = songs.length > 0 ? {
        name: "My Music",
        description: "Your personal music collection",
        coverUrl: songs[0]?.coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600"
    } : null;

    return (
        <div className="flex-1 bg-[#121212] rounded-lg m-2 md:ml-0 overflow-hidden flex flex-col relative">
            {/* Playlist Header */}
            <div className="h-60 md:h-60 bg-gradient-to-b from-indigo-800 to-[#121212] p-6 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white shadow-2xl shadow-black/50 shrink-0">
                    <img src={playlist?.coverUrl} className="w-full h-full object-cover" alt="Playlist" />
                </div>
                <div className="mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Playlist</span>
                    <h1 className="text-2xl md:text-6xl font-black mb-2 md:mb-4 mt-2">{playlist?.name || "My Music"}</h1>
                    <p className="text-white/70 text-sm font-medium line-clamp-2 md:line-clamp-none">{playlist?.description || "Your music collection"}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm font-medium">
                        <span className="text-green-500">Music Player</span>
                        <span className="hidden md:inline">•</span>
                        <span className="text-white/70 hidden md:inline">{songs.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Songs List */}
            <div className="flex-1 bg-gradient-to-b from-[#121212]/50 to-[#121212] p-4 md:p-6 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-center md:justify-start mb-8">
                    <button
                        className="w-14 h-14 rounded-full bg-green-500 text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                        onClick={onTogglePlay}
                    >
                        {isPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                        ) : (
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                        )}
                    </button>
                </div>

                {songs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-white/50 text-lg mb-2">No songs found</p>
                        <p className="text-white/30 text-sm">Add MP3 or M4A files to /public/music/ folder</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:grid grid-cols-[40px_2fr_1fr_100px] gap-4 text-white/50 text-sm border-b border-white/10 pb-2 mb-4 px-4 uppercase tracking-wider font-medium">
                            <span className="text-center">#</span>
                            <span>Title</span>
                            <span>Album</span>
                            <span className="text-right">Duration</span>
                        </div>

                        <div className="space-y-1">
                            {songs.map((song, i) => {
                                const isCurrentSong = currentSong?.id === song.id;
                                const isCurrentPlaying = isCurrentSong && isPlaying;

                                return (
                                    <div
                                        key={song.id}
                                        className={`flex md:grid md:grid-cols-[40px_2fr_1fr_100px] gap-4 px-4 py-3 hover:bg-white/10 rounded-md group text-sm items-center cursor-pointer transition-colors ${isCurrentSong ? 'bg-white/5' : 'text-white/70'}`}
                                        onClick={() => {
                                            if (isCurrentSong) {
                                                onTogglePlay();
                                            } else {
                                                onPlaySong(song);
                                            }
                                        }}
                                    >
                                        <div className="hidden md:flex items-center justify-center">
                                            <span className={`group-hover:hidden ${isCurrentSong ? 'text-green-500' : ''}`}>{i + 1}</span>
                                            {isCurrentPlaying ? (
                                                <Pause className="w-4 h-4 hidden group-hover:block text-white fill-white" />
                                            ) : (
                                                <Play className="w-4 h-4 hidden group-hover:block text-white fill-white" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 flex-1">
                                            <img src={song.coverUrl} className="w-10 h-10 rounded object-cover" alt={song.title} />
                                            <div className="flex flex-col min-w-0">
                                                <p className={`font-medium text-base md:text-sm truncate ${isCurrentSong ? 'text-green-500' : 'text-white'}`}>{song.title}</p>
                                                <p className="text-xs group-hover:text-white truncate">{song.artist}</p>
                                            </div>
                                        </div>
                                        <span className="group-hover:text-white hidden md:block truncate">{song.album}</span>
                                        <span className="text-right ml-auto md:ml-0">{song.duration}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
