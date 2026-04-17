import { useIsMobile } from "@/hooks/use-mobile";

export default function VSCode() {
    const isMobile = useIsMobile();
    
    // Using github1s for a real, working VS Code experience.
    // The user can change the repo URL below.
    const repoUrl = "https://github1s.com/DevStudio2k25/Mhub";

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] overflow-hidden relative">
            {/* Real VS Code Iframe */}
            <div className="flex-1 w-full h-full relative group">
                <iframe
                    src={repoUrl}
                    className="w-full h-full border-none"
                    title="Visual Studio Code"
                    allow="clipboard-read; clipboard-write"
                />
                
                {/* Mobile optimization hint or overlay if needed */}
                {isMobile && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 pointer-events-none" />
                )}
            </div>
        </div>
    );
}
