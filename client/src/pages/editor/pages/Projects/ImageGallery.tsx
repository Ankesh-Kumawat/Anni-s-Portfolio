import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Star, Check, X, Monitor } from "lucide-react";
import type { EditorData } from "../../types";
import { PlatformImageSection } from "./PlatformImageSection";
import { PlatformCoverImageSection } from "./PlatformCoverImageSection";

interface ImageGalleryProps {
    project: any;
    index: number;
    data: EditorData;
    handlers: any;
}

export function ImageGallery({ project, index, data, handlers }: ImageGalleryProps) {
    return (
        <div className="space-y-6">
            {/* Platform-Based Cover Images */}
            {project.platform && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary fill-primary" />
                        <h4 className="text-lg font-bold text-foreground">Cover Images</h4>
                        <Badge className="bg-primary/10 text-primary border-primary">
                            {project.platform.split(", ").length} Platform{project.platform.split(", ").length > 1 ? 's' : ''}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload separate cover image for each platform</p>

                    {project.platform.split(", ").map((platform: string) => (
                        <PlatformCoverImageSection
                            key={platform}
                            platform={platform}
                            coverImage={project.coverImages?.[platform] || ""}
                            projectIndex={index}
                            handlers={handlers}
                        />
                    ))}
                </div>
            )}

            {/* Platform-Specific Images */}
            {project.platform && (
                <div className="space-y-6 pt-6 border-t-2 border-dashed">
                    <div className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-bold text-foreground">Platform Gallery Images</h4>
                        <Badge className="bg-primary/10 text-primary border-primary">
                            {project.platform.split(", ").length} Platform{project.platform.split(", ").length > 1 ? 's' : ''}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload multiple gallery images for each platform</p>

                    {project.platform.split(", ").map((platform: string) => (
                        <PlatformImageSection
                            key={platform}
                            platform={platform}
                            platformImages={project.platformImages?.[platform] || []}
                            projectIndex={index}
                            handlers={handlers}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
