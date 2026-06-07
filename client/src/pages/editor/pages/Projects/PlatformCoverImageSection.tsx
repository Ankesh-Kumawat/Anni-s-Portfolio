import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Star, Monitor, Smartphone, Laptop, Check } from "lucide-react";

interface PlatformCoverImageSectionProps {
    platform: string;
    coverImage: string;
    projectIndex: number;
    handlers: any;
}

export function PlatformCoverImageSection({ platform, coverImage, projectIndex, handlers }: PlatformCoverImageSectionProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // Use useEffect to manage previewUrl reset when selectedFile changes to null
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl("");
        }
    }, [selectedFile]);

    const getPlatformIcon = () => {
        if (platform.toLowerCase().includes('mobile') || platform.toLowerCase().includes('android') || platform.toLowerCase().includes('ios')) {
            return <Smartphone className="w-4 h-4" />;
        }
        if (platform.toLowerCase().includes('desktop')) {
            return <Laptop className="w-4 h-4" />;
        }
        return <Monitor className="w-4 h-4" />;
    };

    const previewUrlRef = useRef<string>("");

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    const normalizeImage = (file: File): Promise<File> =>
        new Promise((resolve) => {
            if (!file.type.startsWith('image/')) {
                console.warn(`⚠️ Skipping non-image file: ${file.name}`);
                resolve(file);
                return;
            }

            console.log(`🔄 Normalizing cover: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)}KB)`);

            const img = new Image();
            img.onload = () => {
                console.log(`✅ Cover loaded: ${file.name} (${img.width}x${img.height})`);
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
                            console.log(`✅ Cover normalized: ${newFile.name}`);
                            URL.revokeObjectURL(img.src);
                            resolve(newFile);
                        } else {
                            console.error(`❌ Canvas toBlob failed for: ${file.name}`);
                            URL.revokeObjectURL(img.src);
                            resolve(file);
                        }
                    }, "image/jpeg", 0.9);
                } else {
                    console.error(`❌ Canvas context failed for: ${file.name}`);
                    URL.revokeObjectURL(img.src);
                    resolve(file);
                }
            };
            img.onerror = (e) => {
                console.error(`❌ BROWSER CAN'T DECODE COVER: ${file.name} (${file.type})`, e);
                URL.revokeObjectURL(img.src);
                resolve(file);
            };
            img.src = URL.createObjectURL(file);
        });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log("PlatformCoverImageSection - handleFileSelect called. File:", file);
        if (file) {
            const normalizedFile = await normalizeImage(file);
            setSelectedFile(normalizedFile);

            // Create Blob URL for preview
            const blobUrl = URL.createObjectURL(normalizedFile);
            previewUrlRef.current = blobUrl;
            setPreviewUrl(blobUrl);
        }
        e.target.value = '';
    };

    const handleUpload = async () => {
        console.log("PlatformCoverImageSection - handleUpload called. selectedFile:", selectedFile);
        if (!selectedFile) return;

        setUploading(true);

        const fakeEvent = {
            target: { files: [selectedFile] }
        } as any;

        try {
            console.log("PlatformCoverImageSection - Calling handler. projectIndex:", projectIndex, "platform:", platform);
            await handlers.handlePlatformCoverImageUpload(projectIndex, platform, fakeEvent);
            console.log("PlatformCoverImageSection - Upload successful");
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
            setSelectedFile(null);
        }
    };

    const cancelSelection = () => {
        setSelectedFile(null);
        setPreviewUrl("");
    };

    return (
        <div className="bg-muted/50 rounded-xl p-4 border-2 border">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {getPlatformIcon()}
                    <h5 className="font-bold text-sm">{platform}</h5>
                    <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500 text-xs">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Cover
                    </Badge>
                </div>
                {coverImage && (
                    <Badge className="bg-primary/10 text-primary border-primary text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Uploaded
                    </Badge>
                )}
            </div>

            {coverImage ? (
                <div className="relative group rounded-lg overflow-hidden border-2 border-primary">
                    <img
                        src={coverImage}
                        alt={`${platform} Cover`}
                        className="w-full h-auto object-contain bg-muted"
                    />
                    <button
                        type="button"
                        onClick={() => handlers.removePlatformCoverImage(projectIndex, platform)}
                        className="absolute top-2 right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        COVER
                    </div>
                </div>
            ) : selectedFile && previewUrl ? (
                <div className="space-y-2">
                    <div className="relative group rounded-lg overflow-hidden border-2 border-yellow-500">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-auto object-contain bg-muted"
                        />
                        <button
                            type="button"
                            onClick={cancelSelection}
                            className="absolute top-2 right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            PREVIEW
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload Cover Image
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-primary rounded-lg p-6 bg-primary/5 hover:bg-primary/10 transition-all text-center">
                        <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Select {platform} Cover</p>
                        <p className="text-xs text-muted-foreground mt-1">Any image format</p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}
