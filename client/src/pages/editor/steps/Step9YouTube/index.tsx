import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, Key, Hash, User, Image, Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { StepProps } from "../../types";

export default function Step9YouTube({ data, setData }: StepProps) {
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string; channelData?: any } | null>(null);

    const updateYouTube = (field: string, value: string) => {
        setData(prev => ({
            ...prev,
            youtube: {
                ...prev.youtube,
                [field]: value
            }
        }));
        setTestResult(null);
    };

    const testConnection = async () => {
        if (!data.youtube.apiKey || !data.youtube.channelId) {
            setTestResult({
                success: false,
                message: "Please enter both API Key and Channel ID"
            });
            return;
        }

        setTesting(true);
        setTestResult(null);

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${data.youtube.channelId}&key=${data.youtube.apiKey}`
            );

            const result = await response.json();

            if (result.error) {
                setTestResult({
                    success: false,
                    message: result.error.message || "Invalid API Key or Channel ID"
                });
            } else if (result.items && result.items.length > 0) {
                const channel = result.items[0];
                setTestResult({
                    success: true,
                    message: "Connection successful!",
                    channelData: {
                        name: channel.snippet.title,
                        logo: channel.snippet.thumbnails.default.url,
                        subscribers: channel.statistics.subscriberCount,
                        videos: channel.statistics.videoCount
                    }
                });

                // Auto-fill channel name and logo
                updateYouTube("channelName", channel.snippet.title);
                updateYouTube("channelLogo", channel.snippet.thumbnails.default.url);
            } else {
                setTestResult({
                    success: false,
                    message: "Channel not found"
                });
            }
        } catch (error) {
            setTestResult({
                success: false,
                message: "Failed to connect. Check your internet connection."
            });
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">YouTube Integration</h2>
                        <p className="text-muted-foreground text-lg">Connect your YouTube channel to display videos</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Status</div>
                            <div className="text-2xl font-bold text-primary">
                                {data.youtube.apiKey && data.youtube.channelId ? "✓" : "○"}
                            </div>
                        </div>
                        <Youtube className="w-6 h-6 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Info Notice */}
            <div className="mb-8 p-6 bg-card border-2 border-red-600/30 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                    <Youtube className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-base font-bold text-foreground">YouTube Data API v3 Required</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get your API key from Google Cloud Console and enable YouTube Data API v3. Your channel videos will automatically load.
                    </p>
                </div>
            </div>

            {/* Setup Instructions */}
            <div className="mb-8 bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 border-2 shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    How to Get API Key & Channel ID
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                            1
                        </div>
                        <div>
                            <p className="font-semibold">Get YouTube API Key</p>
                            <p className="text-sm text-muted-foreground">
                                Go to <a href="https://console.cloud.google.com" target="_blank" className="text-primary hover:underline">Google Cloud Console</a> → Create Project → Enable "YouTube Data API v3" → Create Credentials → API Key
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                            2
                        </div>
                        <div>
                            <p className="font-semibold">Get Channel ID</p>
                            <p className="text-sm text-muted-foreground">
                                Go to your YouTube channel → Click your profile → Settings → Advanced settings → Copy "Channel ID"
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                            3
                        </div>
                        <div>
                            <p className="font-semibold">Test Connection</p>
                            <p className="text-sm text-muted-foreground">
                                Enter both values below and click "Test Connection" to verify
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Form */}
            <div className="bg-card rounded-2xl p-6 border-2 shadow-md space-y-6">
                <h3 className="text-xl font-bold">API Configuration</h3>

                {/* API Key */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        YouTube API Key
                    </label>
                    <Input
                        type="password"
                        value={data.youtube.apiKey}
                        onChange={(e) => updateYouTube("apiKey", e.target.value)}
                        placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Your API key is stored securely in Firebase
                    </p>
                </div>

                {/* Channel ID */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Channel ID
                    </label>
                    <Input
                        value={data.youtube.channelId}
                        onChange={(e) => updateYouTube("channelId", e.target.value)}
                        placeholder="UCxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Found in YouTube Studio → Settings → Advanced
                    </p>
                </div>

                {/* Test Connection Button */}
                <Button
                    onClick={testConnection}
                    disabled={testing || !data.youtube.apiKey || !data.youtube.channelId}
                    className="w-full gap-2"
                    size="lg"
                >
                    {testing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Testing Connection...
                        </>
                    ) : (
                        <>
                            <Youtube className="w-4 h-4" />
                            Test Connection
                        </>
                    )}
                </Button>

                {/* Test Result */}
                {testResult && (
                    <div className={`p-4 rounded-xl border-2 ${
                        testResult.success 
                            ? "bg-green-500/10 border-green-500/30" 
                            : "bg-red-500/10 border-red-500/30"
                    }`}>
                        <div className="flex items-start gap-3">
                            {testResult.success ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className={`font-semibold ${
                                    testResult.success ? "text-green-600" : "text-red-600"
                                }`}>
                                    {testResult.message}
                                </p>
                                {testResult.channelData && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={testResult.channelData.logo} 
                                                alt="Channel" 
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div>
                                                <p className="font-bold">{testResult.channelData.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {parseInt(testResult.channelData.subscribers).toLocaleString()} subscribers • {testResult.channelData.videos} videos
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Manual Override (Optional) */}
                {testResult?.success && (
                    <div className="pt-6 border-t space-y-4">
                        <h4 className="font-semibold text-sm text-muted-foreground">Optional: Override Channel Info</h4>
                        
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Channel Name
                            </label>
                            <Input
                                value={data.youtube.channelName}
                                onChange={(e) => updateYouTube("channelName", e.target.value)}
                                placeholder="Your Channel Name"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <Image className="w-4 h-4" />
                                Channel Logo URL
                            </label>
                            <Input
                                value={data.youtube.channelLogo}
                                onChange={(e) => updateYouTube("channelLogo", e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
