import { useEffect, useState } from "react";
import { X, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { OSNotification as NotificationType } from "@/lib/os-context";

interface OSNotificationProps {
    notification: NotificationType;
    onClose: (id: string) => void;
}

export function OSNotification({ notification, onClose }: OSNotificationProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDissolving, setIsDissolving] = useState(false);

    useEffect(() => {
        // Slide in animation
        setTimeout(() => setIsVisible(true), 10);

        // Start dissolve animation before removal
        const dissolveTimer = setTimeout(() => {
            setIsDissolving(true);
        }, 9000); // Start dissolving at 9 seconds

        // Remove notification after 10 seconds
        const removeTimer = setTimeout(() => {
            onClose(notification.id);
        }, 10000);

        return () => {
            clearTimeout(dissolveTimer);
            clearTimeout(removeTimer);
        };
    }, [notification.id, onClose]);

    const getIcon = () => {
        if (notification.title.includes("✉️") || notification.title.includes("Email")) {
            return <Mail className="w-5 h-5 text-emerald-500" />;
        }
        if (notification.title.includes("❌") || notification.title.includes("Error") || notification.title.includes("Failed")) {
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        }
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
    };

    const handleClose = () => {
        setIsDissolving(true);
        setTimeout(() => {
            onClose(notification.id);
        }, 500);
    };

    return (
        <div
            className={`
                relative overflow-hidden
                bg-gradient-to-br from-background/95 via-background/90 to-muted/95 
                backdrop-blur-xl border border-border/50 
                rounded-xl shadow-2xl
                p-4 mb-3 min-w-[320px] max-w-[400px]
                transition-all duration-500 ease-out
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                ${isDissolving ? 'dissolve-animation' : ''}
            `}
            style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-orange-500/5 animate-pulse" />

            {/* Particle effect overlay when dissolving - Many particles */}
            {isDissolving && (
                <div className="particles-container">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 0.3}s`,
                                animationDuration: `${0.8 + Math.random() * 0.4}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="relative z-10 flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
                    {getIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1 text-foreground">
                        {notification.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                </div>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-muted/50 flex items-center justify-center transition-colors"
                >
                    <X className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30">
                <div
                    className="h-full bg-gradient-to-r from-primary via-purple-500 to-orange-500 animate-progress"
                    style={{
                        animation: 'progress 10s linear forwards'
                    }}
                />
            </div>

            <style>{`
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }

                .dissolve-animation {
                    animation: dissolve 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    will-change: opacity, filter;
                }

                @keyframes dissolve {
                    0% {
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    40% {
                        opacity: 0.6;
                        filter: blur(2px) brightness(1.2);
                    }
                    100% {
                        opacity: 0;
                        filter: blur(8px) brightness(1.5);
                    }
                }

                .particles-container {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 100;
                }

                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: radial-gradient(circle, rgba(249, 115, 22, 1), rgba(251, 146, 60, 0.6), transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    will-change: transform, opacity;
                    animation: particle-explode cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes particle-explode {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) scale(1) rotate(0deg);
                    }
                    20% {
                        opacity: 1;
                        transform: translate(
                            calc(var(--tx) * 0.3),
                            calc(var(--ty) * 0.3)
                        ) scale(1.2) rotate(90deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg);
                    }
                }

                .particle:nth-child(4n) {
                    --tx: ${Math.random() * 200 - 100}px;
                    --ty: ${Math.random() * -150 - 50}px;
                }
                .particle:nth-child(4n+1) {
                    --tx: ${Math.random() * 200 - 100}px;
                    --ty: ${Math.random() * -150 - 50}px;
                }
                .particle:nth-child(4n+2) {
                    --tx: ${Math.random() * 200 - 100}px;
                    --ty: ${Math.random() * -150 - 50}px;
                }
                .particle:nth-child(4n+3) {
                    --tx: ${Math.random() * 200 - 100}px;
                    --ty: ${Math.random() * -150 - 50}px;
                }
            `}</style>
        </div>
    );
}
