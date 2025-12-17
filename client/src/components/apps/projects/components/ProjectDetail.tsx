import { ArrowLeft, Github, ExternalLink, Smartphone, Globe, Monitor, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "../types";
import { useState, useEffect } from "react";

interface ProjectDetailProps {
    project: Project;
    onBack: () => void;
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

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const PlatformIcon = platformIcons[project.platform] || Monitor;

    // Get screenshots (exclude first image which is cover)
    const screenshots = project.images.slice(1);

    // Auto scroll carousel every 5 seconds
    useEffect(() => {
        if (screenshots.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % screenshots.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [screenshots.length]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % screenshots.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-6 py-4">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Button>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Project Header */}
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                            <p className="text-lg text-muted-foreground">{project.tagline}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={`${statusColors[project.status] || statusColors["In Development"]} border`}>
                            {project.status}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {PlatformIcon && <PlatformIcon className="w-4 h-4" />}
                            <span>{project.platform}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                            <Badge key={tech} variant="secondary">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Description */}
                {project.description && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">About</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.description}</p>
                    </section>
                )}

                {/* Overview */}
                {project.overview && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Overview</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.overview}</p>
                    </section>
                )}

                {/* Image Carousel - Only show if there are screenshots (more than just cover) */}
                {screenshots.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Screenshots</h2>
                        <div className="relative w-full aspect-video bg-muted/30 rounded-xl overflow-hidden shadow-lg group">
                            {/* Images container with slide animation */}
                            <div className="relative w-full h-full">
                                {screenshots.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentImageIndex
                                            ? "opacity-100 translate-x-0"
                                            : index < currentImageIndex
                                                ? "opacity-0 -translate-x-full"
                                                : "opacity-0 translate-x-full"
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${project.name} screenshot ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {screenshots.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
                                    >
                                        <ArrowLeft className="w-5 h-5 rotate-180" />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full z-10">
                                        {screenshots.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                    ? "bg-primary w-6"
                                                    : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Image counter */}
                        {screenshots.length > 1 && (
                            <div className="text-center mt-3 text-sm text-muted-foreground">
                                {currentImageIndex + 1} / {screenshots.length}
                            </div>
                        )}
                    </section>
                )}

                {/* Problem → Solution */}
                {(project.problem || project.solution || project.outcome) && (
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold">Problem → Solution</h2>
                        <div className="space-y-4">
                            {project.problem && (
                                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                                    <h3 className="font-medium text-red-700 mb-2">Problem</h3>
                                    <p className="text-sm text-muted-foreground">{project.problem}</p>
                                </div>
                            )}
                            {project.solution && (
                                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                    <h3 className="font-medium text-blue-700 mb-2">Solution</h3>
                                    <p className="text-sm text-muted-foreground">{project.solution}</p>
                                </div>
                            )}
                            {project.outcome && (
                                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                    <h3 className="font-medium text-green-700 mb-2">Outcome</h3>
                                    <p className="text-sm text-muted-foreground">{project.outcome}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Key Features */}
                {project.features && project.features.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Key Features</h2>
                        <div className="grid gap-3">
                            {project.features.map((feature, index) => (
                                <div key={index} className="p-4 rounded-lg border bg-card">
                                    <h3 className="font-medium mb-1">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Architecture & Scale */}
                {(project.architecture.structure || project.architecture.dataHandling || project.architecture.scalability || project.architecture.performance) && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Architecture & Scale</h2>
                        <div className="space-y-3">
                            {project.architecture.structure && (
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Structure</h3>
                                    <p className="text-sm">{project.architecture.structure}</p>
                                </div>
                            )}
                            {project.architecture.dataHandling && (
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Data Handling</h3>
                                    <p className="text-sm">{project.architecture.dataHandling}</p>
                                </div>
                            )}
                            {project.architecture.scalability && (
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Scalability</h3>
                                    <p className="text-sm">{project.architecture.scalability}</p>
                                </div>
                            )}
                            {project.architecture.performance && (
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Performance</h3>
                                    <p className="text-sm">{project.architecture.performance}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Challenges & Learnings */}
                {project.challenges && project.challenges.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Challenges & Learnings</h2>
                        <div className="space-y-4">
                            {project.challenges.map((item, index) => (
                                <div key={index} className="p-4 rounded-lg border bg-card space-y-2">
                                    <div>
                                        <span className="text-xs font-medium text-muted-foreground">Challenge</span>
                                        <p className="text-sm mt-1">{item.challenge}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-muted-foreground">Solution</span>
                                        <p className="text-sm mt-1">{item.solution}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-muted-foreground">Learning</span>
                                        <p className="text-sm mt-1 text-primary">{item.learning}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Links */}
                {(project.github || project.liveDemo || project.relatedProject) && (
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">Links</h2>
                        <div className="flex flex-wrap gap-3">
                            {project.github && (
                                <Button variant="outline" asChild>
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="gap-2">
                                        <Github className="w-4 h-4" />
                                        View on GitHub
                                    </a>
                                </Button>
                            )}
                            {project.liveDemo && (
                                <Button asChild>
                                    <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo
                                    </a>
                                </Button>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
