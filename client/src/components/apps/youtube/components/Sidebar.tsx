import { Home, Grid, Video, Library } from "lucide-react";

export function Sidebar() {
    return (
        <div className="w-20 hidden md:flex flex-col items-center py-4 gap-8 shrink-0">
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-muted p-2 rounded-lg w-16">
                <Home className="w-6 h-6" />
                <span className="text-[10px]">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-muted p-2 rounded-lg w-16">
                <Grid className="w-6 h-6" />
                <span className="text-[10px]">Shorts</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-muted p-2 rounded-lg w-16">
                <Video className="w-6 h-6" />
                <span className="text-[10px]">Subs</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-muted p-2 rounded-lg w-16">
                <Library className="w-6 h-6" />
                <span className="text-[10px]">Library</span>
            </div>
        </div>
    );
}
