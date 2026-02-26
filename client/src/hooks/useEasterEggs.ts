import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useEasterEggs() {
    const { toast } = useToast();
    const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
    const [textSequence, setTextSequence] = useState<string>("");
    
    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    const KONAMI_CODE = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
        "b", "a"
    ];

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Get the key - for arrow keys use e.key directly, for letters use lowercase
            const key = e.key;
            
            // Update Konami sequence
            const newSequence = [...konamiSequence, key].slice(-10);
            setKonamiSequence(newSequence);
            
            // Check if Konami code is complete
            if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
                triggerKonamiEasterEgg();
                setKonamiSequence([]);
            }

            // Simple text-based easter egg - type "konami"
            const newText = (textSequence + key.toLowerCase()).slice(-6);
            setTextSequence(newText);
            
            if (newText === "konami") {
                triggerKonamiEasterEgg();
                setTextSequence("");
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [konamiSequence, textSequence]);

    const triggerKonamiEasterEgg = () => {
        // Screen shake effect
        document.body.style.animation = "shake 0.5s";
        setTimeout(() => {
            document.body.style.animation = "";
        }, 500);

        // Add shake keyframes if not exists
        if (!document.getElementById("shake-keyframes")) {
            const style = document.createElement("style");
            style.id = "shake-keyframes";
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
                @keyframes firework {
                    0% { transform: translate(0, 0) scale(0); opacity: 1; }
                    50% { opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Create multiple firework bursts
        const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"];
        const burstCount = 8;
        const particlesPerBurst = 30;

        for (let burst = 0; burst < burstCount; burst++) {
            setTimeout(() => {
                const centerX = Math.random() * window.innerWidth;
                const centerY = Math.random() * (window.innerHeight * 0.6);

                // Create burst center flash
                const flash = document.createElement("div");
                flash.style.position = "fixed";
                flash.style.left = centerX + "px";
                flash.style.top = centerY + "px";
                flash.style.width = "20px";
                flash.style.height = "20px";
                flash.style.borderRadius = "50%";
                flash.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                flash.style.boxShadow = "0 0 30px 10px currentColor";
                flash.style.pointerEvents = "none";
                flash.style.zIndex = "9999";
                document.body.appendChild(flash);

                setTimeout(() => flash.remove(), 300);

                // Create particles
                for (let i = 0; i < particlesPerBurst; i++) {
                    setTimeout(() => {
                        const particle = document.createElement("div");
                        const angle = (Math.PI * 2 * i) / particlesPerBurst;
                        const velocity = 100 + Math.random() * 150;
                        const tx = Math.cos(angle) * velocity;
                        const ty = Math.sin(angle) * velocity;

                        particle.style.position = "fixed";
                        particle.style.left = centerX + "px";
                        particle.style.top = centerY + "px";
                        particle.style.width = (4 + Math.random() * 6) + "px";
                        particle.style.height = (4 + Math.random() * 6) + "px";
                        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                        particle.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
                        particle.style.pointerEvents = "none";
                        particle.style.zIndex = "9999";
                        particle.style.boxShadow = "0 0 10px currentColor";
                        particle.style.setProperty("--tx", tx + "px");
                        particle.style.setProperty("--ty", ty + "px");

                        document.body.appendChild(particle);

                        const animation = particle.animate([
                            {
                                transform: "translate(0, 0) scale(0) rotate(0deg)",
                                opacity: 1
                            },
                            {
                                transform: `translate(${tx}px, ${ty}px) scale(1) rotate(${Math.random() * 720}deg)`,
                                opacity: 0
                            }
                        ], {
                            duration: 1000 + Math.random() * 500,
                            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                        });

                        animation.onfinish = () => particle.remove();
                    }, i * 5);
                }
            }, burst * 300);
        }

        // Add floating text effects
        const messages = ["🎮 KONAMI!", "💥 BOOM!", "🎉 EPIC!", "⚡ LEGENDARY!"];
        messages.forEach((msg, idx) => {
            setTimeout(() => {
                const text = document.createElement("div");
                text.textContent = msg;
                text.style.position = "fixed";
                text.style.left = "50%";
                text.style.top = "50%";
                text.style.transform = "translate(-50%, -50%)";
                text.style.fontSize = "4rem";
                text.style.fontWeight = "bold";
                text.style.color = colors[idx % colors.length];
                text.style.textShadow = "0 0 20px currentColor, 0 0 40px currentColor";
                text.style.pointerEvents = "none";
                text.style.zIndex = "10000";
                text.style.fontFamily = "Inter, sans-serif";
                document.body.appendChild(text);

                const textAnim = text.animate([
                    {
                        transform: "translate(-50%, -50%) scale(0) rotate(-180deg)",
                        opacity: 0
                    },
                    {
                        transform: "translate(-50%, -50%) scale(1.5) rotate(0deg)",
                        opacity: 1,
                        offset: 0.3
                    },
                    {
                        transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
                        opacity: 1,
                        offset: 0.7
                    },
                    {
                        transform: "translate(-50%, -200%) scale(0.5) rotate(180deg)",
                        opacity: 0
                    }
                ], {
                    duration: 1500,
                    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                });

                textAnim.onfinish = () => text.remove();
            }, idx * 400);
        });

        // Play sound effect (optional - using Web Audio API)
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Audio not supported, skip
        }

        toast({
            title: "🎮 KONAMI CODE ACTIVATED!",
            description: "You unlocked the ultimate easter egg! You're a legend! 🔥",
            duration: 5000,
        });
    };

    return { triggerKonamiEasterEgg };
}
