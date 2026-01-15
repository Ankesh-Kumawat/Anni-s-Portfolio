import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
    imageSrc: string;
    onClose: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

export function ImageModal({ 
    imageSrc, 
    onClose, 
    onNext, 
    onPrevious,
    hasNext = false,
    hasPrevious = false
}: ImageModalProps) {
    // Auto-slide every 2 seconds
    useEffect(() => {
        if (!hasNext || !onNext) return;
        
        const interval = setInterval(() => {
            onNext();
        }, 2000);
        
        return () => clearInterval(interval);
    }, [hasNext, onNext, imageSrc]); // Reset timer when image changes

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight" && hasNext && onNext) onNext();
            if (e.key === "ArrowLeft" && hasPrevious && onPrevious) onPrevious();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            {hasPrevious && onPrevious && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrevious();
                    }}
                    className="absolute left-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all hover:scale-110"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}

            {/* Next Button */}
            {hasNext && onNext && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all hover:scale-110"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            {/* Image */}
            <img
                src={imageSrc}
                alt="Full view"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
