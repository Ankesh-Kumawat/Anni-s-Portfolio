import { YouTubeHeader } from "./components/YouTubeHeader";
import { Sidebar } from "./components/Sidebar";
import { VideoGrid } from "./components/VideoGrid";
import { Home, Grid, Video, Library } from "lucide-react";

export default function YouTube() {
    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <YouTubeHeader />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <VideoGrid />
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden h-12 bg-background border-t flex items-center justify-around z-20 shrink-0">
                <Home className="w-6 h-6" />
                <Grid className="w-6 h-6" />
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <Video className="w-6 h-6" />
                <Library className="w-6 h-6" />
            </div>
        </div>
    );
}
