interface ImageGridProps {
    images: string[];
    onImageClick: (src: string) => void;
}

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((src, i) => (
                <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-muted"
                    onClick={() => onImageClick(src)}
                >
                    <img
                        src={src}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
}
