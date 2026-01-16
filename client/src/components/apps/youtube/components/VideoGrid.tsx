import { YouTubeVideo } from "../hooks/useYouTubeData";

interface VideoGridProps {
    videos: YouTubeVideo[];
    isShorts?: boolean;
}

export function VideoGrid({ videos, isShorts = false }: VideoGridProps) {
    const openVideo = (videoId: string) => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    };

    if (videos.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">No {isShorts ? 'shorts' : 'videos'} found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
            <div className={`grid gap-x-4 gap-y-8 pb-20 ${
                isShorts 
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
                {videos.map((video) => (
                    <div 
                        key={video.id} 
                        className="flex flex-col gap-3 cursor-pointer group"
                        onClick={() => openVideo(video.id)}
                    >
                        <div className={`${
                            isShorts ? 'aspect-[9/16]' : 'aspect-video'
                        } rounded-xl bg-muted overflow-hidden relative`}>
                            <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                                {video.duration}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            {!isShorts && (
                                <div className="w-9 h-9 rounded-full bg-muted flex-shrink-0" />
                            )}
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-semibold line-clamp-2 leading-tight text-sm md:text-base">
                                    {video.title}
                                </span>
                                {!isShorts && (
                                    <>
                                        <span className="text-xs md:text-sm text-muted-foreground mt-1 hover:text-foreground">
                                            {video.channelTitle}
                                        </span>
                                        <span className="text-xs md:text-sm text-muted-foreground">
                                            {video.views} views • {video.publishedAt}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
