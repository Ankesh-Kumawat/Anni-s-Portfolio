import { Badge } from "@/components/ui/badge";
import { ArrowRight, Smartphone, Globe, Monitor, Layers } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

const platformIcons: Record<string, any> = {
    Mobile: Smartphone,
    Web: Globe,
    Desktop: Monitor,
    "Cross-Platform": Layers,
};

const statusColors: Record<string, string> = {
    Active: "bg-green-500/10 text-green-700 border-green-500/20",
    "In Development": "bg-blue-500/10 text-blue-700 border-blue-500/20",
    Rebuilding: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    Completed: "bg-gray-500/10 text-gray-700 border-gray-500/20",
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
    const PlatformIcon = platformIcons[project.platform] || Monitor;

    return (
        <button
            onClick={onClick}
            className="group relative bg-card border rounded-xl overflow-hidden text-left transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 active:scale-[0.98] flex flex-col"
        >
            {/* Cover Image - 16:9 ratio */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
                <img
                    src={project.images[0]}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Status Badge on Image */}
                <div className="absolute top-3 right-3">
                    <Badge className={`${statusColors[project.status] || statusColors["In Development"]} border font-normal text-xs backdrop-blur-sm`}>
                        {project.status}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                            {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.tagline}
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>

                {/* Platform */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {PlatformIcon && <PlatformIcon className="w-3.5 h-3.5" />}
                    <span>{project.platform}</span>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 3).map((tech) => (
                        <span
                            key={tech}
                            className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.techStack.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                            +{project.techStack.length - 3}
                        </span>
                    )}
                </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
    );
}
