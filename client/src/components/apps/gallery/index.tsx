import { useState, useEffect } from "react";
import { ImageModal } from "./components/ImageModal";
import { Folder, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
    id: string;
    name: string;
    type: 'folder' | 'image';
    coverImage?: string;
    imageUrl?: string;
    children?: GalleryItem[];
}

interface GalleryData {
    folders: GalleryItem[];
    directImages: GalleryItem[];
}

export default function Gallery() {
    const [breadcrumb, setBreadcrumb] = useState<GalleryItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [galleryData, setGalleryData] = useState<GalleryData | null>(null);

    useEffect(() => {
        fetch(`/data/gallery.json?t=${Date.now()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(setGalleryData)
            .catch(console.error);
    }, []);

    // Get current items based on breadcrumb
    const getCurrentItems = (): GalleryItem[] => {
        if (!galleryData) return [];
        if (breadcrumb.length === 0) {
            return [...galleryData.folders, ...galleryData.directImages];
        }
        return breadcrumb[breadcrumb.length - 1].children || [];
    };

    const currentItems = getCurrentItems();
    const folders = currentItems.filter(item => item.type === 'folder');
    const images = currentItems.filter(item => item.type === 'image');

    // Navigate into folder
    const openFolder = (folder: GalleryItem) => {
        setBreadcrumb([...breadcrumb, folder]);
    };

    // Go back
    const goBack = () => {
        setBreadcrumb(breadcrumb.slice(0, -1));
    };

    // If image is selected, show modal
    if (selectedImage) {
        return (
            <ImageModal
                imageSrc={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        );
    }

    if (!galleryData) {
        return (
            <div className="h-full bg-background flex items-center justify-center">
                <div className="text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-background flex flex-col">
            {/* Header with Breadcrumb */}
            <div className="border-b bg-muted/20 px-4 py-3">
                <div className="flex items-center gap-2">
                    {breadcrumb.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={goBack}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    )}
                    <div className="flex items-center gap-2 flex-1">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <div className="flex items-center gap-1 text-sm">
                            <span className="font-semibold">Gallery</span>
                            {breadcrumb.map((item) => (
                                <span key={item.id} className="flex items-center gap-1">
                                    <span className="text-muted-foreground">/</span>
                                    <span className="font-semibold">{item.name}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {folders.length > 0 && `${folders.length} folders`}
                        {folders.length > 0 && images.length > 0 && ', '}
                        {images.length > 0 && `${images.length} images`}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {/* Folders Section */}
                {folders.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            Folders ({folders.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => openFolder(folder)}
                                    className="group relative aspect-video rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all bg-muted cursor-pointer hover:shadow-xl"
                                >
                                    {/* Cover Image */}
                                    {folder.coverImage ? (
                                        <img
                                            src={folder.coverImage}
                                            alt={folder.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                            <Folder className="w-20 h-20 text-primary/30" />
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                                        <div className="flex items-center gap-2 text-white mb-1">
                                            <Folder className="w-5 h-5" />
                                            <span className="font-bold text-base">{folder.name}</span>
                                        </div>
                                        <span className="text-sm text-white/80">
                                            {folder.children?.length || 0} items
                                        </span>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Images Section */}
                {images.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Images ({images.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer transition-all bg-muted border-2 border-border hover:border-primary hover:shadow-xl"
                                    onClick={() => setSelectedImage(image.imageUrl!)}
                                >
                                    <img
                                        src={image.imageUrl}
                                        alt={image.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />

                                    {/* Image Name Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-white font-semibold text-sm">{image.name}</span>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {folders.length === 0 && images.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Folder className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-semibold">Empty folder</p>
                        <p className="text-sm">No items to display</p>
                    </div>
                )}
            </div>
        </div>
    );
}
