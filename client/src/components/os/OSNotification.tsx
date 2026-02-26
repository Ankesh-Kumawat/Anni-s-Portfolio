import { useEffect, useState, useRef, useMemo } from "react";
import { X, Mail, AlertCircle, CheckCircle, Sparkles, Terminal, Lightbulb } from "lucide-react";
import { OSNotification as NotificationType } from "@/lib/os-context";
import { cn } from "@/lib/utils";

interface OSNotificationProps {
    notification: NotificationType;
    onClose: (id: string) => void;
}

// Pre-generate sand particle configs
function generateSandParticles(count: number) {
    const particles = [];

    for (let i = 0; i < count; i++) {
        // Spread particles across the entire card area
        const leftPercent = Math.random() * 100;
        const topPercent = Math.random() * 100;

        // Sand falls DOWN with slight horizontal drift
        const fallDistance = 50 + Math.random() * 140;
        const drift = (Math.random() - 0.5) * 50;
        const size = 1.5 + Math.random() * 2.5;

        // Wave pattern: top particles start first, bottom later
        const delay = (topPercent / 100) * 0.5 + Math.random() * 0.25;
        const duration = 0.5 + Math.random() * 0.5;
        const opacity = 0.4 + Math.random() * 0.6;

        particles.push({ leftPercent, topPercent, fallDistance, drift, size, delay, duration, opacity });
    }
    return particles;
}

export function OSNotification({ notification, onClose }: OSNotificationProps) {
    const [phase, setPhase] = useState<"entering" | "visible" | "dissolving" | "gone">("entering");
    const [progress, setProgress] = useState(100);

    // Store onClose in a ref so timer useEffect never re-runs
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    const notifIdRef = useRef(notification.id);

    // Generate sand particles once — more particles for dense sand effect
    const sandParticles = useMemo(() => generateSandParticles(280), []);

    // All timers — runs only once on mount
    useEffect(() => {
        const id = notifIdRef.current;

        const enterTimer = setTimeout(() => setPhase("visible"), 50);

        const startTime = Date.now();
        const duration = 10000;
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) clearInterval(progressInterval);
        }, 50);

        const dissolveTimer = setTimeout(() => setPhase("dissolving"), 9200);

        const removeTimer = setTimeout(() => onCloseRef.current(id), 10600);

        return () => {
            clearTimeout(enterTimer);
            clearInterval(progressInterval);
            clearTimeout(dissolveTimer);
            clearTimeout(removeTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = () => {
        setPhase("dissolving");
        setTimeout(() => onCloseRef.current(notifIdRef.current), 1200);
    };

    const getIcon = () => {
        const title = notification.title.toLowerCase();
        if (title.includes("welcome")) return <Sparkles className="w-5 h-5" />;
        if (title.includes("tip")) return <Lightbulb className="w-5 h-5" />;
        if (title.includes("terminal")) return <Terminal className="w-5 h-5" />;
        if (title.includes("email") || title.includes("mail") || title.includes("sent") || title.includes("message")) return <Mail className="w-5 h-5" />;
        if (title.includes("error") || title.includes("failed")) return <AlertCircle className="w-5 h-5" />;
        return <CheckCircle className="w-5 h-5" />;
    };

    const getAccentColor = () => {
        const title = notification.title.toLowerCase();
        if (title.includes("welcome")) return { from: "#06b6d4", to: "#8b5cf6", glow: "rgba(6,182,212,0.4)" };
        if (title.includes("tip")) return { from: "#f59e0b", to: "#f97316", glow: "rgba(245,158,11,0.4)" };
        if (title.includes("error") || title.includes("failed")) return { from: "#ef4444", to: "#dc2626", glow: "rgba(239,68,68,0.4)" };
        if (title.includes("email") || title.includes("mail") || title.includes("sent") || title.includes("message")) return { from: "#10b981", to: "#059669", glow: "rgba(16,185,129,0.4)" };
        return { from: "#3b82f6", to: "#6366f1", glow: "rgba(59,130,246,0.4)" };
    };

    const accent = getAccentColor();

    if (phase === "gone") return null;

    return (
        <>
            <style>{`
                @keyframes sandFall {
                    0% {
                        opacity: var(--so);
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate3d(var(--sd), var(--sf), 0) scale(0.3);
                    }
                }
                
                @keyframes cardCrumble {
                    0% {
                        opacity: 1;
                        filter: blur(0px);
                        -webkit-mask-image: linear-gradient(to bottom, black 0%, black 100%);
                        mask-image: linear-gradient(to bottom, black 0%, black 100%);
                    }
                    30% {
                        opacity: 0.8;
                        filter: blur(0.5px);
                        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 100%);
                        mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 100%);
                    }
                    60% {
                        opacity: 0.4;
                        filter: blur(1.5px);
                        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 40%, black 65%, black 100%);
                        mask-image: linear-gradient(to bottom, transparent 0%, transparent 40%, black 65%, black 100%);
                    }
                    85% {
                        opacity: 0.15;
                        filter: blur(3px);
                        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 70%, black 90%, black 100%);
                        mask-image: linear-gradient(to bottom, transparent 0%, transparent 70%, black 90%, black 100%);
                    }
                    100% {
                        opacity: 0;
                        filter: blur(4px);
                        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 100%);
                        mask-image: linear-gradient(to bottom, transparent 0%, transparent 100%);
                    }
                }
            `}</style>

            <div
                className={cn(
                    "relative mb-3 w-[380px]",
                    phase === "dissolving" && "pointer-events-none"
                )}
            >
                {/* Sand particles — GPU accelerated, no box-shadow */}
                {phase === "dissolving" && (
                    <div
                        className="absolute inset-0 overflow-visible pointer-events-none z-50"
                        style={{ contain: "layout style" }}
                    >
                        {sandParticles.map((p, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    left: `${p.leftPercent}%`,
                                    top: `${p.topPercent}%`,
                                    width: p.size,
                                    height: p.size,
                                    background: i % 3 === 0 ? accent.from : i % 3 === 1 ? accent.to : `${accent.from}cc`,
                                    willChange: "transform, opacity",
                                    ['--sf' as any]: `${p.fallDistance}px`,
                                    ['--sd' as any]: `${p.drift}px`,
                                    ['--so' as any]: p.opacity,
                                    animation: `sandFall ${p.duration}s cubic-bezier(0.45, 0, 0.85, 0.35) ${p.delay}s forwards`,
                                    opacity: 0,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Outer glow */}
                <div
                    className="absolute -inset-1 rounded-2xl blur-lg pointer-events-none transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${accent.from}20, ${accent.to}15)`,
                        opacity: phase === "dissolving" ? 0 : 0.6,
                    }}
                />

                {/* Main card */}
                <div
                    className={cn(
                        "relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all",
                        phase === "entering" && "translate-x-[120%] opacity-0 scale-95",
                        phase === "visible" && "translate-x-0 opacity-100 scale-100",
                    )}
                    style={{
                        background: "linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,20,35,0.97) 50%, rgba(10,15,30,0.97) 100%)",
                        borderColor: `${accent.from}30`,
                        boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                        transitionDuration: phase === "entering" ? "0ms" : "600ms",
                        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                        ...(phase === "dissolving" ? {
                            animation: "cardCrumble 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                        } : {}),
                    }}
                >
                    {/* Top accent line */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${accent.from}, ${accent.to}, transparent)`,
                        }}
                    />

                    {/* Background mesh */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(at 0% 0%, ${accent.from}15 0%, transparent 50%), radial-gradient(at 100% 100%, ${accent.to}10 0%, transparent 50%)`,
                        }}
                    />

                    {/* Content */}
                    <div className="relative p-4">
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div
                                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                                    boxShadow: `0 4px 15px ${accent.glow}, 0 0 20px ${accent.glow}`,
                                }}
                            >
                                <div className="text-white">{getIcon()}</div>
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-[13px] text-white truncate">
                                        {notification.title}
                                    </h4>
                                    <span className="text-[9px] text-white/30 font-medium flex-shrink-0">
                                        now
                                    </span>
                                </div>
                                <p className="text-[12px] text-white/60 leading-relaxed line-clamp-2">
                                    {notification.message}
                                </p>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all duration-200 group"
                            >
                                <X className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-[3px] bg-white/5">
                        <div
                            className="h-full rounded-full transition-all duration-100 ease-linear"
                            style={{
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                                boxShadow: `0 0 10px ${accent.glow}`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
