import { SpotifySidebar } from "./components/SpotifySidebar";
import { MainContent } from "./components/MainContent";
import { PlayerBar } from "./components/PlayerBar";

export default function Spotify() {
    return (
        <div className="flex flex-col h-full bg-black text-white overflow-hidden">
            <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
                <SpotifySidebar />
                <MainContent />
            </div>
            <PlayerBar />
        </div>
    );
}
