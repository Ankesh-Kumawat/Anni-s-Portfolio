import { useState, useEffect, useCallback, useRef } from "react";
import {
    Terminal,
    Settings,
    RefreshCw,
    Info,
    Monitor,
    ArrowUpDown,
    Palette,
} from "lucide-react";
import { useOS } from "@/lib/os-context";
import { cn } from "@/lib/utils";

interface ContextMenuItem {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    separator?: boolean;
    shortcut?: string;
}

interface DesktopContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onAboutOS: () => void;
}

export function DesktopContextMenu({ x, y, onClose, onAboutOS }: DesktopContextMenuProps) {
    const { launchApp } = useOS();
    const [phase, setPhase] = useState<"entering" | "visible" | "closing">("entering");
    const menuRef = useRef<HTMLDivElement>(null);
    const [adjustedPos, setAdjustedPos] = useState({ x, y });

    // Animate in
    useEffect(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setPhase("visible"));
        });
    }, []);

    // Adjust position to stay within viewport
    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const padding = 10;
            let newX = x;
            let newY = y;

            if (x + rect.width > window.innerWidth - padding) {
                newX = x - rect.width;
            }
            if (y + rect.height > window.innerHeight - padding) {
                newY = y - rect.height;
            }
            if (newX < padding) newX = padding;
            if (newY < padding) newY = padding;

            setAdjustedPos({ x: newX, y: newY });
        }
    }, [x, y]);

    const closeMenu = useCallback(() => {
        setPhase("closing");
        setTimeout(onClose, 180);
    }, [onClose]);

    // Close on click outside or escape
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                closeMenu();
            }
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
            setTimeout(() => {
                onClose();
                action();
            }, 180);
        },
        [onClose]
    );

    const menuItems: ContextMenuItem[] = [
        {
            label: "Open Terminal",
            icon: <Terminal className="w-[14px] h-[14px]" />,
            action: () => closeAndDo(() => launchApp("terminal")),
            shortcut: "Alt+T",
        },
        {
            label: "Open Settings",
            icon: <Settings className="w-[14px] h-[14px]" />,
            action: () => closeAndDo(() => launchApp("settings")),
            separator: true,
        },
        {
            label: "Change Theme",
            icon: <Palette className="w-[14px] h-[14px]" />,
            action: () => closeAndDo(() => launchApp("settings")),
        },
        {
            label: "Display Settings",
            icon: <Monitor className="w-[14px] h-[14px]" />,
            action: () => closeAndDo(() => launchApp("settings")),
            separator: true,
        },
        {
            label: "Refresh Desktop",
            icon: <RefreshCw className="w-[14px] h-[14px]" />,
            action: () => closeAndDo(() => window.location.reload()),
            shortcut: "F5",
        },
        {
            label: "Restart System",
            icon: <ArrowUpDown className="w-[14px] h-[14px]" />,
            action: () =>
                closeAndDo(() => window.dispatchEvent(new Event("os-restart"))),
            separator: true,
        },
        {
            label: "About Portfolio OS",
            icon: <Info className="w-[14px] h-[14px]" />,
            action: () => closeAndDo(onAboutOS),
        },
    ];

    return (
        <>
            <style>{`
                @keyframes menuItemReveal {
                    from {
                        opacity: 0;
                        transform: translateY(-4px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <div
                ref={menuRef}
                className="fixed z-[9998]"
                style={{
                    left: adjustedPos.x,
                    top: adjustedPos.y,
                    transformOrigin: "top left",
                }}
            >
                <div
                    className={cn(
                        "min-w-[220px] rounded-xl overflow-hidden border transition-all",
                        phase === "entering" && "opacity-0 scale-[0.7]",
                        phase === "visible" && "opacity-100 scale-100",
                        phase === "closing" && "opacity-0 scale-[0.85]",
                    )}
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(30,35,50,0.97) 0%, rgba(20,24,38,0.98) 100%)",
                        borderColor: "rgba(255,255,255,0.08)",
                        boxShadow:
                            "0 30px 70px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
                        backdropFilter: "blur(40px) saturate(1.5)",
                        WebkitBackdropFilter: "blur(40px) saturate(1.5)",
                        transitionDuration: phase === "closing" ? "180ms" : "200ms",
                        transitionTimingFunction:
                            phase === "visible"
                                ? "cubic-bezier(0.2, 0.9, 0.3, 1.2)"
                                : "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                >
                    <div className="py-1">
                        {menuItems.map((item, index) => (
                            <div key={index}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        item.action();
                                    }}
                                    className={cn(
                                        "w-full px-3 py-[7px] flex items-center gap-2.5 transition-colors duration-75 group",
                                        "hover:bg-white/[0.07] active:bg-white/[0.10]"
                                    )}
                                    style={
                                        phase === "visible"
                                            ? {
                                                  animation: `menuItemReveal 0.2s ease-out ${index * 0.03}s both`,
                                              }
                                            : { opacity: phase === "closing" ? 1 : 0 }
                                    }
                                >
                                    <span className="text-white/35 group-hover:text-white/75 transition-colors duration-75 flex-shrink-0">
                                        {item.icon}
                                    </span>
                                    <span className="text-[12.5px] text-white/65 group-hover:text-white/95 transition-colors duration-75 flex-1 text-left">
                                        {item.label}
                                    </span>
                                    {item.shortcut && (
                                        <span className="text-[10px] text-white/20 font-mono tracking-wider flex-shrink-0">
                                            {item.shortcut}
                                        </span>
                                    )}
                                </button>
                                {item.separator && (
                                    <div className="mx-2.5 my-[3px] h-px bg-white/[0.05]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
