import { VIDEOS } from "../constants";

export function VideoGrid() {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pb-20">
                {VIDEOS.map((video, i) => (
                    <div key={i} className="flex flex-col gap-3 cursor-pointer group">
                        <div className="aspect-video rounded-xl bg-muted overflow-hidden relative">
                            <img src={video.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded font-medium">12:34</span>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0" />
                            <div className="flex flex-col">
                                <span className="font-semibold line-clamp-2 leading-tight text-sm md:text-base">{video.title}</span>
                                <span className="text-xs md:text-sm text-muted-foreground mt-1 hover:text-foreground">{video.channel}</span>
                                <span className="text-xs md:text-sm text-muted-foreground">{video.views} • {video.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
