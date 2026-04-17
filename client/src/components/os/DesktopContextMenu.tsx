import { useState, useEffect, useCallback, useRef } from "react";
import {
    Terminal,
    Settings,
    RefreshCw,
    Info,
    Monitor,
    Palette,
    LayoutGrid,
    Power,
    Code,
} from "lucide-react";
import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";

interface ContextMenuSection {
    items: ContextMenuItem[];
}

interface ContextMenuItem {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    shortcut?: string;
    danger?: boolean;
}

interface DesktopContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onAboutOS: () => void;
    onAutoArrange?: () => void;
}

export function DesktopContextMenu({ x, y, onClose, onAboutOS, onAutoArrange }: DesktopContextMenuProps) {
    const { launchApp } = useOS();
    const [phase, setPhase] = useState<"entering" | "visible" | "closing">("entering");
    const menuRef = useRef<HTMLDivElement>(null);
    const [adjustedPos, setAdjustedPos] = useState({ x, y });

    useEffect(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setPhase("visible"));
        });
    }, []);

    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const padding = 10;
            let newX = x;
            let newY = y;
            if (x + rect.width > window.innerWidth - padding) newX = x - rect.width;
            if (y + rect.height > window.innerHeight - padding) newY = y - rect.height;
            if (newX < padding) newX = padding;
            if (newY < padding) newY = padding;
            setAdjustedPos({ x: newX, y: newY });
        }
    }, [x, y]);

    const closeMenu = useCallback(() => {
        setPhase("closing");
        setTimeout(onClose, 180);
    }, [onClose]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu();
        };
        const handleRightClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                e.preventDefault();
                closeMenu();
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeMenu();
        };
        const timer = setTimeout(() => {
            window.addEventListener("mousedown", handleClick);
            window.addEventListener("contextmenu", handleRightClick);
            window.addEventListener("keydown", handleEscape);
        }, 50);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousedown", handleClick);
            window.removeEventListener("contextmenu", handleRightClick);
            window.removeEventListener("keydown", handleEscape);
        };
    }, [closeMenu]);

    const closeAndDo = useCallback(
        (action: () => void) => {
            setPhase("closing");
            setTimeout(() => { onClose(); action(); }, 180);
        },
        [onClose]
    );

    const sections: ContextMenuSection[] = [
        {
            items: [
                {
                    label: "Auto-Arrange Icons",
                    icon: <LayoutGrid className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(() => onAutoArrange?.()),
                    shortcut: "⌘A",
                },
                {
                    label: "Refresh Desktop",
                    icon: <RefreshCw className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(() => window.location.reload()),
                    shortcut: "F5",
                },
            ],
        },
        {
            items: [
                {
                    label: "Open Terminal",
                    icon: <Terminal className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(() => launchApp("terminal")),
                    shortcut: "Alt+T",
                },
                {
                    label: "VS Code",
                    icon: <Code className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(() => launchApp("vscode")),
                },
            ],
        },
        {
            items: [
                {
                    label: "Personalization",
                    icon: <Palette className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(() => launchApp("settings")),
                },
                {
                    label: "Display Settings",
                    icon: <Monitor className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(() => launchApp("settings")),
                },
                {
                    label: "Settings",
                    icon: <Settings className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(() => launchApp("settings")),
                },
            ],
        },
        {
            items: [
                {
                    label: "About Portfolio OS",
                    icon: <Info className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(onAboutOS),
                },
                {
                    label: "Restart System",
                    icon: <Power className="w-3.5 h-3.5" />,
                    action: () => closeAndDo(() => window.dispatchEvent(new Event("os-restart"))),
                    danger: true,
                },
            ],
        },
    ];

    return (
        <>
            <style>{`
                @keyframes ctxReveal {
                    from { opacity: 0; transform: translateY(-3px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            <div
                ref={menuRef}
                className="fixed z-[9998]"
                style={{ left: adjustedPos.x, top: adjustedPos.y }}
            >
                <div
                    className={cn(
                        "min-w-[230px] rounded-2xl overflow-hidden border transition-all",
                        phase === "entering" && "opacity-0 scale-[0.85] -translate-y-1",
                        phase === "visible" && "opacity-100 scale-100 translate-y-0",
                        phase === "closing" && "opacity-0 scale-[0.92] -translate-y-1",
                    )}
                    style={{
                        background: "rgba(20,22,30,0.92)",
                        borderColor: "rgba(255,255,255,0.07)",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.05) inset",
                        backdropFilter: "blur(48px) saturate(1.8)",
                        WebkitBackdropFilter: "blur(48px) saturate(1.8)",
                        transitionDuration: phase === "closing" ? "150ms" : "220ms",
                        transitionTimingFunction: phase === "visible"
                            ? "cubic-bezier(0.16, 1, 0.3, 1)"
                            : "cubic-bezier(0.4, 0, 1, 1)",
                    }}
                >
                    {sections.map((section, sIdx) => (
                        <div key={sIdx}>
                            {sIdx > 0 && (
                                <div
                                    className="mx-3 my-[3px]"
                                    style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
                                />
                            )}
                            <div className="py-1 px-1">
                                {section.items.map((item, iIdx) => {
                                    const globalIdx = sections.slice(0, sIdx).reduce((a, s) => a + s.items.length, 0) + iIdx;
                                    return (
                                        <button
                                            key={iIdx}
                                            onClick={(e) => { e.stopPropagation(); item.action(); }}
                                            className={cn(
                                                "w-full px-3 py-[7px] flex items-center gap-3 rounded-lg transition-all duration-75 group cursor-pointer",
                                                item.danger
                                                    ? "hover:bg-red-500/10 active:bg-red-500/15"
                                                    : "hover:bg-white/[0.06] active:bg-white/[0.10]"
                                            )}
                                            style={
                                                phase === "visible"
                                                    ? { animation: `ctxReveal 0.2s ease-out ${globalIdx * 0.025}s both` }
                                                    : {}
                                            }
                                        >
                                            <span className={cn(
                                                "transition-colors duration-75 flex-shrink-0",
                                                item.danger
                                                    ? "text-red-400/60 group-hover:text-red-400"
                                                    : "text-white/30 group-hover:text-white/70"
                                            )}>
                                                {item.icon}
                                            </span>
                                            <span className={cn(
                                                "text-[12.5px] font-medium transition-colors duration-75 flex-1 text-left",
                                                item.danger
                                                    ? "text-red-300/60 group-hover:text-red-300"
                                                    : "text-white/60 group-hover:text-white/95"
                                            )}>
                                                {item.label}
                                            </span>
                                            {item.shortcut && (
                                                <span className="text-[10px] text-white/18 font-mono tracking-wider flex-shrink-0 ml-auto">
                                                    {item.shortcut}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
