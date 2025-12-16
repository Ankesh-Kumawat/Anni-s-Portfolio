import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Heart, SkipBack } from "lucide-react";

export function MainContent() {
    return (
        <div className="flex-1 bg-[#121212] rounded-lg m-2 md:ml-0 overflow-hidden flex flex-col relative">
            <div className="md:hidden absolute top-4 left-4 z-20 flex gap-4">
                <div className="bg-black/50 p-2 rounded-full backdrop-blur-md"><SkipBack className="w-4 h-4" /></div>
            </div>

            <div className="h-60 md:h-60 bg-gradient-to-b from-indigo-800 to-[#121212] p-6 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white shadow-2xl shadow-black/50 shrink-0">
                    <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
                </div>
                <div className="mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Playlist</span>
                    <h1 className="text-2xl md:text-6xl font-black mb-2 md:mb-4 mt-2">Deep Focus</h1>
                    <p className="text-white/70 text-sm font-medium line-clamp-2 md:line-clamp-none">Keep calm and focus with ambient and post-rock music.</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm font-medium">
                        <span className="text-green-500">Spotify</span>
                        <span className="hidden md:inline">•</span>
                        <span className="text-white/70 hidden md:inline">1,234,567 likes</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-gradient-to-b from-[#121212]/50 to-[#121212] p-4 md:p-6 overflow-y-auto">
                <div className="flex items-center justify-center md:justify-start gap-6 mb-8">
                    <button className="w-14 h-14 rounded-full bg-green-500 text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                        <Play className="w-6 h-6 fill-current" />
                    </button>
                    <Heart className="w-8 h-8 text-white/70 hover:text-white cursor-pointer" />
                    <span className="text-white/70 hover:text-white cursor-pointer text-2xl pb-3">...</span>
                </div>

                <div className="hidden md:grid grid-cols-[16px_1fr_1fr_40px] gap-4 text-white/50 text-sm border-b border-white/10 pb-2 mb-4 px-4 uppercase tracking-wider">
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <span className="text-right">Clock</span>
                </div>

                <div className="space-y-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="flex md:grid md:grid-cols-[16px_1fr_1fr_40px] gap-4 px-4 py-2 hover:bg-white/10 rounded-md group text-sm text-white/70 items-center cursor-pointer">
                            <span className="group-hover:hidden hidden md:block">{i + 1}</span>
                            <Play className="w-4 h-4 hidden group-hover:block text-white fill-white hidden md:block" />
                            <div className="flex items-center gap-3 flex-1">
                                <img src={`https://picsum.photos/40/40?random=${i}`} className="w-10 h-10 rounded" />
                                <div className="flex flex-col">
                                    <p className="text-white font-medium text-base md:text-sm">Midnight City</p>
                                    <p className="text-xs group-hover:text-white">M83</p>
                                </div>
                            </div>
                            <span className="group-hover:text-white hidden md:block">Hurry Up, We're Dreaming</span>
                            <span className="text-right ml-auto md:ml-0">4:03</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
