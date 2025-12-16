import { useState } from "react";
import { ImageGrid } from "./components/ImageGrid";
import { ImageModal } from "./components/ImageModal";
import { IMAGES } from "./constants";

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="h-full bg-background p-4 overflow-y-auto no-scrollbar">
            {selectedImage ? (
                <ImageModal
                    imageSrc={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            ) : (
                <ImageGrid
                    images={IMAGES}
                    onImageClick={setSelectedImage}
                />
            )}
        </div>
    );
}
