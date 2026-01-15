import { Briefcase } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
    project: Project;
    platform?: string; // Specific platform to show cover image for
    onClick: () => void;
}

export function ProjectCard({ project, platform, onClick }: ProjectCardProps) {
    // Get cover image - if platform prop provided, use that specific platform's image
    const getCoverImage = () => {
        if (platform && project.coverImages?.[platform]) {
            return project.coverImages[platform];
        }
        
        if (project.coverImages && Object.keys(project.coverImages).length > 0) {
            // Try to get platform-specific cover image
            const platformCover = project.coverImages[project.platform];
            if (platformCover) return platformCover;
            
            // Fallback to any available cover image
            return Object.values(project.coverImages)[0];
        }
        
        // Legacy fallback
        return project.coverImage || project.images?.[0] || '';
    };

    const coverImageUrl = getCoverImage();

    // Determine card aspect ratio based on platform
    const getAspectRatio = () => {
        const currentPlatform = platform || project.platform;
        if (currentPlatform === "Mobile") {
            return "aspect-[9/16]"; // Mobile portrait
        }
        return "aspect-video"; // Desktop/Web landscape
    };

    return (
        <button
            onClick={onClick}
            className="group relative bg-card border rounded-xl overflow-hidden text-left transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 active:scale-[0.98] flex flex-col"
        >
            {/* Cover Image with dynamic aspect ratio */}
            <div className={`relative w-full ${getAspectRatio()} bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden`}>
                {coverImageUrl ? (
                    <img
                        src={coverImageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback to gradient if image fails to load
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-primary/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Project Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors">
                        {project.name}
                    </h3>
                </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
    );
}
