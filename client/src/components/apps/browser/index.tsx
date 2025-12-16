import { useState } from "react";
import { BrowserToolbar } from "./components/BrowserToolbar";
import { Lock } from "lucide-react";

export default function Browser() {
    const [url, setUrl] = useState("https://google.com");
    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <BrowserToolbar
                url={url}
                loading={loading}
                onUrlChange={setUrl}
                onRefresh={handleRefresh}
            />

            <div className="flex-1 bg-white relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                    <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Secure Browser</h2>
                    <p className="max-w-md text-center px-4">
                        This is a simulated browser environment. Real web browsing is restricted for security.
                    </p>
                </div>
            </div>
        </div>
    );
}
