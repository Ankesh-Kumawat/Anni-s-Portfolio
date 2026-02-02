import { useState } from "react";
import { Search, ArrowLeft, X } from "lucide-react";
import { YouTubeChannel } from "../hooks/useYouTubeData";

interface YouTubeHeaderProps {
    channel: YouTubeChannel | null;
    onSearch: (query: string) => void;
    onProfileClick: () => void;
    onBack?: () => void;
    searchQuery?: string;
    showBackButton?: boolean;
}

export function YouTubeHeader({ 
    channel, 
    onSearch, 
    onProfileClick, 
    onBack,
    searchQuery = "",
    showBackButton = false
}: YouTubeHeaderProps) {
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (localQuery.trim()) {
            onSearch(localQuery);
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setLocalQuery("");
        onSearch("");
        setIsSearching(false);
    };

    return (
        <div className="h-14 flex items-center justify-between px-4 border-b bg-background z-10 shrink-0">
            <div className="flex items-center gap-2">
                {showBackButton ? (
                    <button onClick={onBack} className="hover:bg-muted p-1.5 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                ) : null}
                {/* YouTube Logo - Hidden on mobile */}
                <div className="hidden md:flex items-center cursor-pointer">
                    <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center gap-2 px-2 md:px-8">
                <div className="flex-1 flex items-center border rounded-full overflow-hidden">
                    <input 
                        placeholder="Search" 
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        onFocus={() => setIsSearching(true)}
                        className="flex-1 h-10 px-4 bg-transparent outline-none text-sm" 
                    />
                    {localQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="px-3 hover:bg-muted/50 h-full flex items-center"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                    <button 
                        type="submit"
                        className="h-10 w-16 bg-muted border-l flex items-center justify-center hover:bg-muted/80"
                    >
                        <Search className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>
            </form>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
                {channel ? (
                    <img 
                        src={channel.logo} 
                        alt={channel.name}
                        onClick={onProfileClick}
                        className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 ring-primary transition-all"
                    />
                ) : (
                    <div 
                        onClick={onProfileClick}
                        className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:ring-2 ring-primary transition-all"
                    >
                        Y
                    </div>
                )}
            </div>
        </div>
    );
}
