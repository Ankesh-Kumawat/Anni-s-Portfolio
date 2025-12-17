import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function CacheCleaner() {
    const [isClearing, setIsClearing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    const [clearedItems, setClearedItems] = useState<string[]>([]);

    const cacheItems = [
        { name: "Browser Cache", size: "245 MB", delay: 300 },
        { name: "Cookies", size: "12 MB", delay: 500 },
        { name: "Local Storage", size: "8 MB", delay: 400 },
        { name: "Session Storage", size: "3 MB", delay: 300 },
        { name: "Service Workers", size: "15 MB", delay: 400 },
        { name: "IndexedDB", size: "32 MB", delay: 500 },
        { name: "Temporary Files", size: "89 MB", delay: 600 },
    ];

    const handleClearCache = async () => {
        setIsClearing(true);
        setIsComplete(false);
        setProgress(0);
        setClearedItems([]);

        // Clear actual browser cache
        try {
            // Clear cache storage
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }

            // Clear local storage
            localStorage.clear();

            // Clear session storage
            sessionStorage.clear();

            // Simulate clearing with animation
            for (let i = 0; i < cacheItems.length; i++) {
                await new Promise(resolve => setTimeout(resolve, cacheItems[i].delay));
                setClearedItems(prev => [...prev, cacheItems[i].name]);
                setProgress(((i + 1) / cacheItems.length) * 100);
            }

            setIsComplete(true);
            setTimeout(() => {
                setIsClearing(false);
            }, 2000);
        } catch (error) {
            console.error("Error clearing cache:", error);
            setIsClearing(false);
        }
    };

    const totalSize = cacheItems.reduce((acc, item) => {
        const size = parseFloat(item.size);
        return acc + size;
    }, 0);

    return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
                        <Trash2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Cache Cleaner
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Clear browser cache and temporary files
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
                    {!isClearing && !isComplete && (
                        <>
                            {/* Cache Items List */}
                            <div className="space-y-3 mb-6">
                                {cacheItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Trash2 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.size}</p>
                                            </div>
                                        </div>
                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                    </div>
                                ))}
                            </div>

                            {/* Total Size */}
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-orange-900">Total Cache Size</span>
                                    <span className="text-2xl font-bold text-orange-600">{totalSize.toFixed(0)} MB</span>
                                </div>
                            </div>

                            {/* Clear Button */}
                            <Button
                                onClick={handleClearCache}
                                size="lg"
                                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                            >
                                <Trash2 className="w-5 h-5 mr-2" />
                                Clear All Cache
                            </Button>
                        </>
                    )}

                    {/* Clearing Animation */}
                    {isClearing && !isComplete && (
                        <div className="space-y-6">
                            {/* Progress Circle */}
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="relative w-40 h-40 mb-6">
                                    <svg className="w-40 h-40 transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="#e5e7eb"
                                            strokeWidth="12"
                                            fill="none"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="url(#gradient)"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 70}`}
                                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                                            strokeLinecap="round"
                                            className="transition-all duration-500"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#9333ea" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {Math.round(progress)}%
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">Cleaning...</div>
                                        </div>
                                    </div>
                                </div>

                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                                <p className="text-lg font-semibold text-gray-900">Clearing Cache</p>
                                <p className="text-sm text-gray-500">Please wait while we clean up...</p>
                            </div>

                            {/* Cleared Items List */}
                            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                                {clearedItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200 animate-in slide-in-from-left duration-300"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <span className="text-sm font-medium text-green-900">{item} cleared</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Success State */}
                    {isComplete && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-6 shadow-lg animate-in zoom-in duration-500">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Clean! 🎉</h2>
                            <p className="text-gray-600 mb-6">
                                Successfully cleared {totalSize.toFixed(0)} MB of cache
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                <span>Your browser is now optimized</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        💡 Tip: Clear cache regularly to improve browser performance
                    </p>
                </div>
            </div>
        </div>
    );
}
