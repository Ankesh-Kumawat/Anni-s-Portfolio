import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Upload, X, GripVertical, Monitor, Smartphone, Laptop } from "lucide-react";

interface PlatformImageSectionProps {
    platform: string;
    platformImages: string[];
    projectIndex: number;
    handlers: any;
}

export function PlatformImageSection({ platform, platformImages, projectIndex, handlers }: PlatformImageSectionProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [previews, setPreviews] = useState<string[]>([]);
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

    // Clear previews when selection is cleared
    useEffect(() => {
        if (selectedFiles.length === 0) {
            setPreviews([]);
        }
    }, [selectedFiles]);

    const getPlatformIcon = () => {
        if (platform.toLowerCase().includes('mobile') || platform.toLowerCase().includes('android') || platform.toLowerCase().includes('ios')) {
            return <Smartphone className="w-4 h-4" />;
        }
        if (platform.toLowerCase().includes('desktop')) {
            return <Laptop className="w-4 h-4" />;
        }
        return <Monitor className="w-4 h-4" />;
    };

    const objectUrlsRef = useRef<string[]>([]); // Track object URLs for cleanup

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            objectUrlsRef.current = [];
        };
    }, []);

    const normalizeImage = (file: File): Promise<File> =>
        new Promise((resolve) => {
            // If it's not an image, return as is (or handle error)
            if (!file.type.startsWith('image/')) {
                console.warn(`⚠️ Skipping non-image file: ${file.name} (${file.type})`);
                resolve(file);
                return;
            }

            console.log(`🔄 Normalizing: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)}KB)`);

            const img = new Image();
            img.onload = () => {
                console.log(`✅ Image loaded successfully: ${file.name} (${img.width}x${img.height})`);
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
                            console.log(`✅ Canvas encode successful: ${newFile.name} (${(newFile.size / 1024).toFixed(2)}KB)`);
                            URL.revokeObjectURL(img.src);
                            resolve(newFile);
                        } else {
                            console.error(`❌ Canvas toBlob failed for: ${file.name}`);
                            URL.revokeObjectURL(img.src);
                            resolve(file); // Fallback to original
                        }
                    }, "image/jpeg", 0.9);
                } else {
                    console.error(`❌ Canvas context failed for: ${file.name}`);
                    URL.revokeObjectURL(img.src);
                    resolve(file);
                }
            };
            img.onerror = (e) => {
                console.error(`❌ BROWSER CAN'T DECODE: ${file.name} (${file.type}) - likely CMYK or incompatible format`, e);
                URL.revokeObjectURL(img.src);
                resolve(file); // Fallback if image load fails
            };
            img.src = URL.createObjectURL(file);
        });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        console.log("PlatformImageSection - handleFileSelect called. Files:", files);

        if (files.length > 0) {
            // Process/Normalize all files, track success
            const results = await Promise.all(
                files.map(async (file, idx) => {
                    const normalized = await normalizeImage(file);
                    const wasNormalized = normalized !== file; // If same object, normalization failed
                    return { file: normalized, wasNormalized, originalFile: file };
                })
            );

            const normalizedFiles = results.map(r => r.file);
            const failedCount = results.filter(r => !r.wasNormalized && r.originalFile.type.startsWith('image/')).length;

            console.log(`PlatformImageSection - Normalization complete. Success: ${results.length - failedCount}, Failed: ${failedCount}`);

            setSelectedFiles((prev) => {
                const newFiles = [...prev, ...normalizedFiles];
                console.log("PlatformImageSection - updating selectedFiles. New count:", newFiles.length);
                return newFiles;
            });

            // Create previews - use placeholder for failed images
            const newPreviews = results.map(({ file, wasNormalized, originalFile }, idx) => {
                if (!wasNormalized && originalFile.type.startsWith('image/')) {
                    // This image failed to normalize - return special marker
                    console.warn(`⚠️ Preview placeholder for incompatible: ${originalFile.name}`);
                    return 'INCOMPATIBLE_IMAGE_PLACEHOLDER';
                }
                const url = URL.createObjectURL(file);
                objectUrlsRef.current.push(url);
                return url;
            });

            console.log("PlatformImageSection - Previews created. Count:", newPreviews.length);
            setPreviews((prev) => [...prev, ...newPreviews]);

            if (failedCount > 0) {
                console.warn(`⚠️ ${failedCount} image(s) couldn't be previewed (likely CMYK format). They will still be uploaded correctly.`);
            }
        }
        // Reset input value
        e.target.value = '';
    };

    const handleUpload = async () => {
        console.log("PlatformImageSection - handleUpload called. selectedFiles count:", selectedFiles.length);
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setProgress({ current: 0, total: selectedFiles.length });

        const fakeEvent = {
            target: { files: selectedFiles }
        } as any;

        try {
            console.log("PlatformImageSection - Calling handler");
            await handlers.handlePlatformImageUpload(projectIndex, platform, fakeEvent, (current: number, total: number) => {
                console.log(`PlatformImageSection - Progress: ${current}/${total}`);
                setProgress({ current, total });
            });
            console.log("PlatformImageSection - Upload successful");
        } catch (err) {
            console.error("PlatformImageSection - Upload failed", err);
        } finally {
            setUploading(false);
            setSelectedFiles([]);
            setPreviews([]);
            setProgress({ current: 0, total: 0 });
        }
    };

    return (
        <div className="bg-muted/50 rounded-xl p-6 border-2 border">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {getPlatformIcon()}
                    <h5 className="font-bold text-foreground">{platform}</h5>
                    <Badge className="bg-primary/10 text-primary border-primary text-xs">
                        {platformImages.length} images
                    </Badge>
                </div>
            </div>

            <label className="cursor-pointer block mb-4">
                <div className="border-2 border-dashed border rounded-xl p-4 bg-card hover:border-primary hover:bg-primary/10 transition-all text-center">
                    <Upload className="w-6 h-6 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Select {platform} Images</p>
                    <p className="text-xs text-muted-foreground mt-1">Multiple images supported</p>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </label>

            {selectedFiles.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-yellow-900 dark:text-yellow-100">
                            {selectedFiles.length} Selected
                        </p>
                        <button
                            type="button"
                            onClick={() => setSelectedFiles([])}
                            className="text-xs text-yellow-700 hover:text-yellow-900 font-medium"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-3">
                        {previews.map((preview, idx) => (
                            <div key={idx} className="relative rounded-lg overflow-hidden border-2 border-yellow-500">
                                {preview === 'INCOMPATIBLE_IMAGE_PLACEHOLDER' ? (
                                    <div className="w-full h-24 bg-muted flex flex-col items-center justify-center text-yellow-900 dark:text-yellow-100">
                                        <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span className="text-xs font-bold">CMYK</span>
                                        <span className="text-xs">Will upload</span>
                                    </div>
                                ) : (
                                    <img
                                        src={preview}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-24 object-cover bg-muted"
                                        onError={(e) => console.error(`Preview ${idx + 1} failed (Blob URL)`, e)}
                                    />
                                )}
                                <div className="absolute bottom-1 left-1 bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                                    #{idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>

                    {uploading && (
                        <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-yellow-900 dark:text-yellow-100 font-medium">Uploading...</span>
                                <span className="text-yellow-700 font-bold">{progress.current} / {progress.total}</span>
                            </div>
                            <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-yellow-500 h-full transition-all duration-300"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-4 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading {progress.current}/{progress.total}...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload {selectedFiles.length} Images
                            </>
                        )}
                    </button>
                </div>
            )}

            {platformImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {platformImages.map((imageUrl: string, imgIdx: number) => {
                        const isDragging = draggedIdx === imgIdx;
                        const isBeingDraggedOver = dragOverIdx === imgIdx;

                        return (
                            <div
                                key={`${platform}-${imgIdx}`}
                                draggable
                                onDragStart={(e) => { setDraggedIdx(imgIdx); e.dataTransfer.effectAllowed = 'move'; }}
                                onDragOver={(e) => { e.preventDefault(); if (draggedIdx !== null && draggedIdx !== imgIdx) setDragOverIdx(imgIdx); }}
                                onDragLeave={() => setDragOverIdx(null)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedIdx !== null && draggedIdx !== imgIdx) {
                                        handlers.handlePlatformDragEnd(projectIndex, platform, {
                                            source: { index: draggedIdx },
                                            destination: { index: imgIdx }
                                        });
                                    }
                                    setDraggedIdx(null);
                                    setDragOverIdx(null);
                                }}
                                onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
                                className={`relative group rounded-xl overflow-hidden border-4 cursor-grab active:cursor-grabbing ${isDragging ? "border-primary z-50 opacity-50" : isBeingDraggedOver ? "opacity-40 border-primary" : "opacity-100 border-muted"
                                    }`}
                            >
                                <div className={`absolute top-2 left-2 w-8 h-8 bg-black/70 rounded-lg flex items-center justify-center z-10 pointer-events-none transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}>
                                    <GripVertical className="w-5 h-5 text-white" />
                                </div>

                                <img
                                    src={imageUrl}
                                    alt={`${platform} ${imgIdx + 1}`}
                                    className="w-full h-auto object-contain select-none pointer-events-none bg-muted"
                                    draggable={false}
                                />

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlers.removePlatformImage(projectIndex, platform, imgIdx);
                                    }}
                                    className={`absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-lg flex items-center justify-center z-20 transition-opacity ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold">
                                    #{imgIdx + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
