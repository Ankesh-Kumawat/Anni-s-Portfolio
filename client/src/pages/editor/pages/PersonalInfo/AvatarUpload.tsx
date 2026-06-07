import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Loader2, Camera } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
    avatar: string;
    onAvatarChange: (url: string) => void;
}

export default function AvatarUpload({ avatar, onAvatarChange }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const url = await uploadToCloudinary(file);
            onAvatarChange(url);
            toast({ title: "Uploaded" });
        } catch {
            toast({ title: "Upload failed", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative group mb-3">
                <Avatar className="h-28 w-28 border-2 border-border shadow-sm">
                    <AvatarImage src={avatar} alt="Avatar" className="object-cover" />
                    <AvatarFallback className="bg-muted">
                        <User className="h-12 w-12 text-muted-foreground/50" />
                    </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    {uploading ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : (
                        <Camera className="h-5 w-5 text-white" />
                    )}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                </label>
            </div>
            <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" disabled={uploading} asChild>
                    <span>
                        {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                        {uploading ? "Uploading..." : "Upload Photo"}
                    </span>
                </Button>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG. Min 400x400px</p>
        </div>
    );
}
