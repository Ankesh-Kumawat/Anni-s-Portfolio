interface ImageModalProps {
    imageSrc: string;
    onClose: () => void;
}

export function ImageModal({ imageSrc, onClose }: ImageModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
            onClick={onClose}
        >
            <img
                src={imageSrc}
                alt="Full view"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button className="absolute top-4 right-4 text-white hover:text-gray-300">
                Close
            </button>
        </div>
    );
}
