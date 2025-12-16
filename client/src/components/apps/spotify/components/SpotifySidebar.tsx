import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Search, Library, Music, Plus } from "lucide-react";
import { Playlist } from "../types";

interface SpotifySidebarProps {
    playlists: Playlist[];
}

export function SpotifySidebar({ playlists }: SpotifySidebarProps) {
    return (
        <div className="hidden md:flex w-64 bg-black flex-col gap-2 p-2 shrink-0">
            <div className="bg-[#121212] rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-4 text-white/70 hover:text-white cursor-pointer transition-colors font-medium">
                    <Home className="w-6 h-6" />
                    Home
                </div>
                <div className="flex items-center gap-4 text-white/70 hover:text-white cursor-pointer transition-colors font-medium">
                    <Search className="w-6 h-6" />
                    Search
                </div>
            </div>

            <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
                <div className="p-4 shadow-lg z-10">
                    <div className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer transition-colors font-medium">
                        <div className="flex items-center gap-2">
                            <Library className="w-6 h-6" />
                            Your Library
                        </div>
                        <Plus className="w-5 h-5" />
                    </div>

                    <div className="flex gap-2 mt-4">
                        <span className="bg-[#232323] px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-[#2a2a2a]">Playlists</span>
                        <span className="bg-[#232323] px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-[#2a2a2a]">Artists</span>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-2 no-scrollbar">
                    <div className="space-y-2 p-2">
                        {playlists.map((playlist) => (
                            <div key={playlist.id} className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer group">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md flex-shrink-0 overflow-hidden">
                                    <img src={playlist.coverUrl} className="w-full h-full object-cover" alt={playlist.name} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate font-medium group-hover:text-green-500 transition-colors">{playlist.name}</p>
                                    <p className="text-xs text-white/50 truncate flex items-center gap-1">
                                        <Music className="w-3 h-3" />
                                        {playlist.songs.length} songs
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
