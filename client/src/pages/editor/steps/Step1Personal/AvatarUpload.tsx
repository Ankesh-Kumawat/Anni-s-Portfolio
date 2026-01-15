import { useState } from "react";
import { Upload, User, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
    avatar: string;
    onAvatarChange: (url: string) => void;
}

export default function AvatarUpload({ avatar, onAvatarChange }: AvatarUploadProps) {
    const [avatarPreview, setAvatarPreview] = useState(avatar);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setUploading(true);
                
                // Show preview immediately
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result as string);
                };
                reader.readAsDataURL(file);

                // Upload to Cloudinary
                const cloudinaryUrl = await uploadToCloudinary(file);
                
                // Update with Cloudinary URL
                onAvatarChange(cloudinaryUrl);
                setAvatarPreview(cloudinaryUrl);
                
                toast({
                    title: "Image Uploaded!",
                    description: "Your avatar has been uploaded to Cloudinary",
                });
            } catch (error) {
                console.error("Upload error:", error);
                toast({
                    title: "Upload Failed",
                    description: "Could not upload image. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="text-center space-y-4">
                <div className="relative inline-block">
                    {avatarPreview ? (
                        <div className="relative group">
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-32 h-32 rounded-2xl object-cover border-2 border-background shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-2xl bg-muted flex items-center justify-center border-2 border-background shadow-lg">
                            <User className="w-16 h-16 text-muted-foreground/60" />
                        </div>
                    )}
                </div>
                <label className="cursor-pointer block">
                    <div className={`px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-semibold flex items-center justify-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {uploading ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-3 h-3" />
                                {avatarPreview ? "Change" : "Upload"}
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
                <p className="text-xs text-muted-foreground">Square image, min 400x400px</p>
            </div>
        </div>
    );
}
