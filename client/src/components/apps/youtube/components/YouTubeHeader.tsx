import { useState } from "react";
import { Search, Menu, Bell, Mic, Video } from "lucide-react";
import { YouTubeChannel } from "../hooks/useYouTubeData";

interface YouTubeHeaderProps {
    channel: YouTubeChannel | null;
    onSearch: (query: string) => void;
    onProfileClick: () => void;
    searchQuery?: string;
}

export function YouTubeHeader({ channel, onSearch, onProfileClick, searchQuery = "" }: YouTubeHeaderProps) {
    const [localQuery, setLocalQuery] = useState(searchQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(localQuery);
    };

    return (
        <div className="h-14 flex items-center justify-between px-4 border-b bg-background z-10 shrink-0">
            <div className="flex items-center gap-4">
                <Menu className="w-6 h-6 cursor-pointer" />
                <div className="flex items-center gap-1 cursor-pointer">
                    <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5" />
                    </div>
                    <span className="font-bold tracking-tighter text-lg hidden sm:inline">
                        {channel?.name || "YouTube"}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center gap-4 px-2 md:px-8">
                <div className="flex-1 flex items-center">
                    <div className="flex-1 h-10 border rounded-full md:rounded-l-full px-4 flex items-center shadow-inner bg-muted/20">
                        <input 
                            placeholder="Search" 
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="bg-transparent w-full outline-none text-sm" 
                        />
                    </div>
                    <button 
                        type="submit"
                        className="h-10 w-16 bg-muted border border-l-0 rounded-r-full flex items-center justify-center hover:bg-muted/80 cursor-pointer hidden md:flex"
                    >
                        <Search className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 cursor-pointer hidden md:flex">
                    <Mic className="w-5 h-5" />
                </div>
            </form>

            <div className="flex items-center gap-3 md:gap-4">
                <Video className="w-6 h-6 cursor-pointer hidden sm:block" />
                <Bell className="w-6 h-6 cursor-pointer" />
                {channel ? (
                    <img 
                        src={channel.logo} 
                        alt={channel.name}
                        onClick={onProfileClick}
                        className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 ring-primary transition-all"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm cursor-pointer">
                        Y
                    </div>
                )}
            </div>
        </div>
    );
}
