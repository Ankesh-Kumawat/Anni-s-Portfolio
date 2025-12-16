import { useState, useRef } from "react";
import { BrowserToolbar } from "./components/BrowserToolbar";
import { BrowserHome } from "./components/BrowserHome";
import { useOS } from "@/lib/os-context";

export default function Browser() {
    const [url, setUrl] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showHome, setShowHome] = useState(true);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { launchApp } = useOS();

    const handleNavigate = (newUrl: string) => {
        if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
            newUrl = "https://" + newUrl;
        }
        setLoading(true);
        setCurrentUrl(newUrl);
        setUrl(newUrl);
        setShowHome(false);

        // Add to history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        setTimeout(() => setLoading(false), 1500);
    };

    const handleHome = () => {
        setShowHome(true);
        setUrl("");
        setCurrentUrl("");
    };

    const handleRefresh = () => {
        if (showHome) return;
        setLoading(true);
        if (iframeRef.current) {
            iframeRef.current.src = currentUrl;
        }
        setTimeout(() => setLoading(false), 1000);
    };

    const handleBack = () => {
        if (showHome) return;

        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            const prevUrl = history[newIndex];
            setHistoryIndex(newIndex);
            setCurrentUrl(prevUrl);
            setUrl(prevUrl);
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
        } else if (historyIndex === 0) {
            // Go back to home page
            handleHome();
        }
    };

    const handleForward = () => {
        if (showHome && history.length > 0) {
            // Go forward from home to first history item
            const firstUrl = history[0];
            setHistoryIndex(0);
            setCurrentUrl(firstUrl);
            setUrl(firstUrl);
            setShowHome(false);
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
        } else if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            const nextUrl = history[newIndex];
            setHistoryIndex(newIndex);
            setCurrentUrl(nextUrl);
            setUrl(nextUrl);
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const handleOpenApp = (appId: string) => {
        launchApp(appId as any);
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <BrowserToolbar
                url={url}
                loading={loading}
                showHome={showHome}
                onUrlChange={setUrl}
                onNavigate={handleNavigate}
                onRefresh={handleRefresh}
                onBack={handleBack}
                onForward={handleForward}
                onHome={handleHome}
            />

            <div className="flex-1 bg-white relative overflow-hidden">
                {showHome ? (
                    <BrowserHome
                        onNavigate={handleNavigate}
                        onOpenApp={handleOpenApp}
                    />
                ) : (
                    <iframe
                        ref={iframeRef}
                        src={currentUrl}
                        className="w-full h-full border-0"
                        title="Browser"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                        onLoad={() => setLoading(false)}
                    />
                )}
            </div>
        </div>
    );
}
