import { useState, useRef } from "react";
import { BrowserToolbar } from "./components/BrowserToolbar";
import { BrowserHome } from "./components/BrowserHome";
import { useOS } from "@/lib/os-context";

export default function Browser() {
    const [url, setUrl] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showHome, setShowHome] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { launchApp } = useOS();

    const handleNavigate = (newUrl: string) => {
        if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
            newUrl = "https://" + newUrl;
        }

        // Only allow portfolio to load in iframe, open others externally
        const isPortfolio = newUrl.includes("anni-portfolio-eight.vercel.app");

        if (!isPortfolio) {
            // Open in new tab for all non-portfolio sites
            window.open(newUrl, "_blank", "noopener,noreferrer");
            return;
        }

        setLoading(true);
        setLoadError(false);
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

            <div className="flex-1 bg-background relative overflow-hidden">
                {showHome ? (
                    <BrowserHome
                        onNavigate={handleNavigate}
                        onOpenApp={handleOpenApp}
                    />
                ) : (
                    <>
                        <iframe
                            ref={iframeRef}
                            src={currentUrl}
                            className="w-full h-full border-0"
                            title="Browser"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                            onLoad={() => setLoading(false)}
                            onError={() => setLoadError(true)}
                        />
                        {loadError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
                                <div className="max-w-md text-center p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Cannot Load Website</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        This website cannot be displayed in an embedded browser. Many sites (like YouTube, Google, Facebook) block iframe embedding for security reasons.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <a
                                            href={currentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            Open in New Tab
                                        </a>
                                        <button
                                            onClick={handleHome}
                                            className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
                                        >
                                            Back to Home
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
