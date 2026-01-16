import { Home, Grid, Video, Library, User } from "lucide-react";

interface SidebarProps {
    activeTab: "home" | "shorts";
    onTabChange: (tab: "home" | "shorts") => void;
    videosCount: number;
    shortsCount: number;
    onProfileClick: () => void;
}

export function Sidebar({ activeTab, onTabChange, videosCount, shortsCount, onProfileClick }: SidebarProps) {
    return (
        <div className="w-20 hidden md:flex flex-col items-center py-4 gap-8 shrink-0">
            <button 
                onClick={() => onTabChange("home")}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg w-16 transition-colors ${
                    activeTab === "home" ? "bg-muted" : "hover:bg-muted"
                }`}
            >
                <Home className="w-6 h-6" />
                <span className="text-[10px]">Home</span>
                {videosCount > 0 && (
                    <span className="text-[9px] text-muted-foreground">({videosCount})</span>
                )}
            </button>
            <button 
                onClick={() => onTabChange("shorts")}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg w-16 transition-colors ${
                    activeTab === "shorts" ? "bg-muted" : "hover:bg-muted"
                }`}
            >
                <Grid className="w-6 h-6" />
                <span className="text-[10px]">Shorts</span>
                {shortsCount > 0 && (
                    <span className="text-[9px] text-muted-foreground">({shortsCount})</span>
                )}
            </button>
            <button 
                onClick={onProfileClick}
                className="flex flex-col items-center gap-1 p-2 rounded-lg w-16 transition-colors hover:bg-muted"
            >
                <User className="w-6 h-6" />
                <span className="text-[10px]">Channel</span>
            </button>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-muted p-2 rounded-lg w-16 opacity-50">
                <Video className="w-6 h-6" />
                <span className="text-[10px]">Subs</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-muted p-2 rounded-lg w-16 opacity-50">
                <Library className="w-6 h-6" />
                <span className="text-[10px]">Library</span>
            </div>
        </div>
    );
}
