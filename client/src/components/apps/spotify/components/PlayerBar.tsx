import { Heart, Shuffle, SkipBack, SkipForward, Repeat, Play, Mic2, ListMusic, Volume2 } from "lucide-react";

export function PlayerBar() {
    return (
        <div className="h-20 md:h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-4 w-full md:w-[30%]">
                <img src="https://picsum.photos/56/56" className="rounded w-10 h-10 md:w-14 md:h-14" />
                <div className="flex-1 md:flex-none">
                    <p className="text-sm font-medium hover:underline cursor-pointer">Midnight City</p>
                    <p className="text-xs text-white/70 hover:underline cursor-pointer hover:text-white">M83</p>
                </div>
                <Heart className="w-5 h-5 text-green-500 ml-2" />
                <div className="md:hidden ml-auto">
                    <Play className="w-8 h-8 fill-white" />
                </div>
            </div>

            <div className="hidden md:flex flex-col items-center gap-2 max-w-[40%] w-full">
                <div className="flex items-center gap-6">
                    <Shuffle className="w-4 h-4 text-white/70 hover:text-white cursor-pointer" />
                    <SkipBack className="w-5 h-5 text-white/70 hover:text-white cursor-pointer fill-current" />
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                        <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                    </div>
                    <SkipForward className="w-5 h-5 text-white/70 hover:text-white cursor-pointer fill-current" />
                    <Repeat className="w-4 h-4 text-white/70 hover:text-white cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 w-full text-xs text-white/70 font-mono">
                    <span>0:00</span>
                    <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden group cursor-pointer">
                        <div className="h-full w-1/3 bg-white group-hover:bg-green-500 rounded-full" />
                    </div>
                    <span>4:03</span>
                </div>
            </div>

            <div className="hidden md:flex items-center justify-end gap-3 w-[30%]">
                <Mic2 className="w-4 h-4 text-white/70 hover:text-white" />
                <ListMusic className="w-4 h-4 text-white/70 hover:text-white" />
                <div className="flex items-center gap-2 w-24">
                    <Volume2 className="w-4 h-4 text-white/70" />
                    <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden group cursor-pointer">
                        <div className="h-full w-2/3 bg-white group-hover:bg-green-500 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
