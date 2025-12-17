import { useEffect, useState } from "react";

interface BootScreenProps {
    onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate boot progress - minimum 8 seconds
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 300);
                    return 100;
                }
                return prev + 1.25; // 100 / 1.25 = 80 intervals * 100ms = 8 seconds
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
            {/* Logo/Image */}
            <div className="mb-12">
                <img
                    src="/assets/personal/avatar.jpg"
                    alt="OS Logo"
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>

            {/* Progress Bar - Minimal white */}
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                    className="h-full bg-white transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
