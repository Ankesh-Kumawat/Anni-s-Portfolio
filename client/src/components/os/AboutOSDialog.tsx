import { useState, useEffect } from "react";
import { X, Monitor, Cpu, Globe, Palette, Code, Layers, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface AboutOSDialogProps {
    onClose: () => void;
}

export function AboutOSDialog({ onClose }: AboutOSDialogProps) {
    const [phase, setPhase] = useState<"entering" | "visible" | "closing">("entering");

    useEffect(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setPhase("visible"));
        });
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    const handleClose = () => {
        setPhase("closing");
        setTimeout(onClose, 250);
    };

    const techStack = [
        { name: "React 19", color: "#61dafb" },
        { name: "TypeScript", color: "#3178c6" },
        { name: "Vite 7", color: "#646cff" },
        { name: "TailwindCSS", color: "#38bdf8" },
        { name: "Firebase", color: "#ffca28" },
        { name: "Express.js", color: "#68a063" },
        { name: "Cloudinary", color: "#3448c5" },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-[9999] transition-all duration-300",
                    phase === "entering" && "bg-black/0",
                    phase === "visible" && "bg-black/50 backdrop-blur-sm",
                    phase === "closing" && "bg-black/0",
                )}
                onClick={handleClose}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto w-[400px] rounded-2xl border overflow-hidden transition-all",
                        phase === "entering" && "opacity-0 scale-90 translate-y-4",
                        phase === "visible" && "opacity-100 scale-100 translate-y-0",
                        phase === "closing" && "opacity-0 scale-95 translate-y-2",
                    )}
                    style={{
                        background: "linear-gradient(180deg, rgba(22,28,45,0.98) 0%, rgba(15,18,30,0.99) 100%)",
                        borderColor: "rgba(255,255,255,0.08)",
                        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
                        backdropFilter: "blur(40px) saturate(1.5)",
                        transitionDuration: phase === "closing" ? "200ms" : "350ms",
                        transitionTimingFunction: phase === "visible" ? "cubic-bezier(0.2, 0.9, 0.3, 1.1)" : "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors z-10 group"
                    >
                        <X className="w-4 h-4 text-white/30 group-hover:text-white/70" />
                    </button>

                    {/* Content */}
                    <div className="p-8 flex flex-col items-center text-center">
                        {/* OS Logo/Icon */}
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                            style={{
                                background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
                                boxShadow: "0 8px 30px rgba(6,182,212,0.3), 0 8px 30px rgba(139,92,246,0.2)",
                            }}
                        >
                            <Monitor className="w-10 h-10 text-white" />
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-white mb-1">
                            Portfolio OS
                        </h2>
                        <p className="text-[13px] text-white/40 mb-5">
                            Version 2.0.0
                        </p>

                        {/* Info Grid */}
                        <div className="w-full space-y-2 mb-5">
                            <InfoRow
                                icon={<Code className="w-3.5 h-3.5" />}
                                label="Developer"
                                value="Ankesh Kumawat"
                            />
                            <InfoRow
                                icon={<Layers className="w-3.5 h-3.5" />}
                                label="Platform"
                                value="Web Application"
                            />
                            <InfoRow
                                icon={<Globe className="w-3.5 h-3.5" />}
                                label="Browser"
                                value={getBrowserName()}
                            />
                            <InfoRow
                                icon={<Cpu className="w-3.5 h-3.5" />}
                                label="Resolution"
                                value={`${window.screen.width} x ${window.screen.height}`}
                            />
                            <InfoRow
                                icon={<Palette className="w-3.5 h-3.5" />}
                                label="Display"
                                value={`${window.devicePixelRatio}x Retina`}
                            />
                        </div>

                        {/* Tech Stack */}
                        <div className="w-full mb-5">
                            <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-2.5">
                                Built With
                            </p>
                            <div className="flex flex-wrap justify-center gap-1.5">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech.name}
                                        className="px-2.5 py-1 rounded-md text-[10px] font-semibold border"
                                        style={{
                                            color: tech.color,
                                            borderColor: `${tech.color}25`,
                                            background: `${tech.color}08`,
                                        }}
                                    >
                                        {tech.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="w-full pt-4 border-t border-white/[0.05]">
                            <p className="text-[11px] text-white/25">
                                Crafted with passion in Sikar, Rajasthan
                            </p>
                            <p className="text-[10px] text-white/15 mt-1">
                                {new Date().getFullYear()} Ankesh Kumawat. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Helper component
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
            }}
        >
            <span className="text-white/25">{icon}</span>
            <span className="text-[11px] text-white/40 flex-1 text-left">{label}</span>
            <span className="text-[11px] text-white/75 font-medium">{value}</span>
        </div>
    );
}

function getBrowserName(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Edg/")) return "Microsoft Edge";
    if (ua.includes("Chrome/")) return "Google Chrome";
    if (ua.includes("Firefox/")) return "Mozilla Firefox";
    if (ua.includes("Safari/") && !ua.includes("Chrome")) return "Apple Safari";
    if (ua.includes("Opera/") || ua.includes("OPR/")) return "Opera";
    return "Unknown Browser";
}
