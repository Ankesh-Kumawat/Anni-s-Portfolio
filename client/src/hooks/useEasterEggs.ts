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
        // Create confetti effect
        const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement("div");
                confetti.style.position = "fixed";
                confetti.style.left = Math.random() * 100 + "%";
                confetti.style.top = "-10px";
                confetti.style.width = "10px";
                confetti.style.height = "10px";
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
                confetti.style.pointerEvents = "none";
                confetti.style.zIndex = "9999";
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                
                document.body.appendChild(confetti);
                
                const animation = confetti.animate([
                    { 
                        transform: `translate(0, 0) rotate(0deg)`,
                        opacity: 1
                    },
                    { 
                        transform: `translate(${(Math.random() - 0.5) * 200}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: 2000 + Math.random() * 1000,
                    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                });
                
                animation.onfinish = () => confetti.remove();
            }, i * 10);
        }
        
        toast({
            title: "🎮 Konami Code Activated!",
            description: "You found the secret! You're a true gamer at heart.",
            duration: 5000,
        });
    };

    return { triggerKonamiEasterEgg };
}
