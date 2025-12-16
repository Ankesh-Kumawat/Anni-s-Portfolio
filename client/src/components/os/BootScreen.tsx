import { useState } from "react";
import { Power } from "lucide-react";

interface BootScreenProps {
    onBootComplete: () => void;
}

export function BootScreen({ onBootComplete }: BootScreenProps) {
    const [isBooting, setIsBooting] = useState(false);

    const handlePowerClick = () => {
        setIsBooting(true);
        // Boot animation duration
        setTimeout(() => {
            onBootComplete();
        }, 3000);
    };

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            {!isBooting ? (
                // Power Button
                <button
                    onClick={handlePowerClick}
                    className="group relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-zinc-700 flex items-center justify-center hover:border-blue-500 transition-all duration-300 hover:scale-110">
                        <Power className="w-16 h-16 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-zinc-500 text-sm mt-4 text-center group-hover:text-zinc-300 transition-colors">
                        Press to start
                    </p>
                </button>
            ) : (
                // Boot Animation
                <div className="flex flex-col items-center gap-8">
                    {/* Logo Animation */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-50 animate-pulse" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-spin-slow">
                            <Power className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Loading Text */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Booting System
                        </h2>
                        <div className="flex gap-1 justify-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress" />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-spin-slow {
                    animation: spin-slow 2s linear infinite;
                }
                .animate-progress {
                    animation: progress 3s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
}
