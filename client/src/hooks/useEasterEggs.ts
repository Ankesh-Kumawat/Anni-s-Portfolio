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
        // Create canvas for smooth animations
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d')!;
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number;
            maxLife: number;
            color: string;
            size: number;
            alpha: number;
        }> = [];

        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316'];

        // Create firework bursts
        const createBurst = (x: number, y: number) => {
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const speed = 2 + Math.random() * 4;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    maxLife: 60 + Math.random() * 40,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: 3 + Math.random() * 4,
                    alpha: 1
                });
            }
        };

        // Create multiple bursts
        let burstCount = 0;
        const maxBursts = 12;
        const burstInterval = setInterval(() => {
            if (burstCount >= maxBursts) {
                clearInterval(burstInterval);
                return;
            }
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.7;
            createBurst(x, y);
            burstCount++;
        }, 200);

        // Animation loop
        let frame = 0;
        const animate = () => {
            frame++;
            
            // Fade out canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1; // gravity
                p.vx *= 0.99; // friction
                p.life++;
                
                // Update alpha
                p.alpha = 1 - (p.life / p.maxLife);
                
                // Remove dead particles
                if (p.life >= p.maxLife) {
                    particles.splice(i, 1);
                    continue;
                }
                
                // Draw particle with glow
                ctx.save();
                ctx.globalAlpha = p.alpha;
                
                // Outer glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(p.x - p.size * 3, p.y - p.size * 3, p.size * 6, p.size * 6);
                
                // Inner particle
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }

            // Continue animation
            if (particles.length > 0 || burstCount < maxBursts) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    canvas.remove();
                }, 1000);
            }
        };

        animate();

        // Animated text overlay
        const textOverlay = document.createElement('div');
        textOverlay.style.position = 'fixed';
        textOverlay.style.top = '50%';
        textOverlay.style.left = '50%';
        textOverlay.style.transform = 'translate(-50%, -50%)';
        textOverlay.style.fontSize = '6rem';
        textOverlay.style.fontWeight = '900';
        textOverlay.style.background = 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b)';
        textOverlay.style.backgroundSize = '300% 300%';
        textOverlay.style.backgroundClip = 'text';
        textOverlay.style.webkitBackgroundClip = 'text';
        textOverlay.style.color = 'transparent';
        textOverlay.style.textShadow = '0 0 40px rgba(59, 130, 246, 0.5)';
        textOverlay.style.pointerEvents = 'none';
        textOverlay.style.zIndex = '10000';
        textOverlay.style.fontFamily = 'Inter, sans-serif';
        textOverlay.style.letterSpacing = '0.1em';
        textOverlay.textContent = 'KONAMI!';
        document.body.appendChild(textOverlay);

        // Animate gradient
        let gradientPos = 0;
        const gradientInterval = setInterval(() => {
            gradientPos += 5;
            textOverlay.style.backgroundPosition = `${gradientPos}% 50%`;
        }, 50);

        // Animate text
        const textAnim = textOverlay.animate([
            {
                transform: 'translate(-50%, -50%) scale(0) rotate(-180deg)',
                opacity: 0
            },
            {
                transform: 'translate(-50%, -50%) scale(1.2) rotate(0deg)',
                opacity: 1,
                offset: 0.3
            },
            {
                transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
                opacity: 1,
                offset: 0.7
            },
            {
                transform: 'translate(-50%, -50%) scale(0) rotate(180deg)',
                opacity: 0
            }
        ], {
            duration: 2500,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        });

        textAnim.onfinish = () => {
            clearInterval(gradientInterval);
            textOverlay.remove();
        };

        toast({
            title: "🎮 KONAMI CODE ACTIVATED!",
            description: "Epic! You're a true legend! 🔥",
            duration: 5000,
        });
    };

    return { triggerKonamiEasterEgg };
}
