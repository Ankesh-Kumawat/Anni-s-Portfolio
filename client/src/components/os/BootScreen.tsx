import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface BootScreenProps {
    onComplete: () => void;
}

const BOOT_MESSAGES = [
    "Initializing system kernel...",
    "Loading hardware drivers...",
    "Mounting file systems...",
    "Starting network services...",
    "Loading UI components...",
    "Configuring display manager...",
    "Starting window compositor...",
    "Loading applications...",
    "Applying user preferences...",
    "Starting Portfolio OS...",
];

export function BootScreen({ onComplete }: BootScreenProps) {
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(0);
    const [phase, setPhase] = useState<"booting" | "logo" | "fadeout">("booting");
    const [logoVisible, setLogoVisible] = useState(false);

    // Boot messages progression
    useEffect(() => {
        if (phase !== "booting") return;

        const messageInterval = setInterval(() => {
            setCurrentMessage((prev) => {
                if (prev >= BOOT_MESSAGES.length - 1) {
                    clearInterval(messageInterval);
                    return prev;
                }
                return prev + 1;
            });
        }, 500);

        return () => clearInterval(messageInterval);
    }, [phase]);

    // Progress bar
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Transition to logo reveal
                    setTimeout(() => setPhase("logo"), 200);
                    return 100;
                }
                // Vary speed for realism
                const speed = prev < 30 ? 2.5 : prev < 70 ? 1.8 : prev < 90 ? 1.2 : 2;
                return Math.min(100, prev + speed);
            });
        }, 80);

        return () => clearInterval(interval);
    }, []);

    // Logo phase
    useEffect(() => {
        if (phase !== "logo") return;
        const timer1 = setTimeout(() => setLogoVisible(true), 100);
        const timer2 = setTimeout(() => setPhase("fadeout"), 2000);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [phase]);

    // Fadeout
    useEffect(() => {
        if (phase !== "fadeout") return;
        const timer = setTimeout(onComplete, 600);
        return () => clearTimeout(timer);
    }, [phase, onComplete]);

    // Generate random "code" lines for background
    const bgLines = useMemo(() => {
        const lines = [];
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._/=+[]{}|;:@#$%&";
        for (let i = 0; i < 30; i++) {
            let line = "  ";
            const prefix = ["[OK] ", "[  ] ", " -> ", "... ", " >> ", "    "][Math.floor(Math.random() * 6)];
            line += prefix;
            const len = 20 + Math.floor(Math.random() * 40);
            for (let j = 0; j < len; j++) {
                line += chars[Math.floor(Math.random() * chars.length)];
            }
            lines.push(line);
        }
        return lines;
    }, []);

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500",
                phase === "fadeout" ? "opacity-0" : "opacity-100"
            )}
            style={{
                background: "radial-gradient(ellipse at center, #0a0e1a 0%, #000000 70%)",
            }}
        >
            {/* Subtle animated grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Background scrolling text (BIOS-style) - only during boot phase */}
            {phase === "booting" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 opacity-[0.06]">
                        {bgLines.slice(0, Math.floor((progress / 100) * bgLines.length)).map((line, i) => (
                            <p key={i} className="text-[10px] font-mono text-cyan-400 whitespace-nowrap leading-5">
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Boot phase content */}
            {phase === "booting" && (
                <div className="flex flex-col items-center gap-8 z-10">
                    {/* Spinning loader */}
                    <div className="relative w-16 h-16">
                        <div
                            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                            style={{
                                borderTopColor: "#06b6d4",
                                borderRightColor: "#06b6d430",
                                animationDuration: "1s",
                            }}
                        />
                        <div
                            className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
                            style={{
                                borderBottomColor: "#8b5cf6",
                                borderLeftColor: "#8b5cf630",
                                animationDuration: "1.5s",
                                animationDirection: "reverse",
                            }}
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <span
                                className="text-[11px] font-mono font-bold tabular-nums"
                                style={{
                                    background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>

                    {/* Boot message */}
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-[12px] font-mono text-white/50 h-4 transition-all duration-200">
                            {BOOT_MESSAGES[currentMessage]}
                        </p>

                        {/* Progress bar */}
                        <div className="w-72 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-200 ease-out"
                                style={{
                                    width: `${progress}%`,
                                    background: "linear-gradient(90deg, #06b6d4, #8b5cf6)",
                                    boxShadow: "0 0 15px rgba(6,182,212,0.5), 0 0 30px rgba(139,92,246,0.3)",
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Logo reveal phase */}
            {(phase === "logo" || phase === "fadeout") && (
                <div
                    className={cn(
                        "flex flex-col items-center gap-6 z-10 transition-all duration-700",
                        logoVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
                    )}
                    style={{
                        transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.3, 1.1)",
                    }}
                >
                    {/* OS Logo */}
                    <div className="relative">
                        {/* Glow ring */}
                        <div
                            className="absolute -inset-4 rounded-full blur-2xl opacity-40"
                            style={{
                                background: "radial-gradient(circle, rgba(6,182,212,0.4), rgba(139,92,246,0.3), transparent)",
                            }}
                        />
                        <div
                            className="relative w-24 h-24 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
                                boxShadow: "0 10px 40px rgba(6,182,212,0.4), 0 10px 40px rgba(139,92,246,0.3)",
                            }}
                        >
                            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                        </div>
                    </div>

                    {/* OS Name */}
                    <div className="text-center">
                        <h1
                            className="text-2xl font-bold tracking-tight mb-1"
                            style={{
                                background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Portfolio OS
                        </h1>
                        <p className="text-[11px] text-white/25 font-medium tracking-widest uppercase">
                            by Ankesh Kumawat
                        </p>
                    </div>
                </div>
            )}

            {/* Bottom branding */}
            <div className="absolute bottom-8 flex flex-col items-center gap-2">
                <p className="text-[10px] text-white/10 font-mono tracking-wider">
                    v2.0.0
                </p>
            </div>
        </div>
    );
}
