import { useState, useMemo } from "react";
import { ImageModal } from "./components/ImageModal";
import { Image as ImageIcon, Monitor, Smartphone, Globe, Layers, Briefcase, ArrowLeft, FolderOpen } from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { useWindowState } from "@/hooks/useWindowState";

interface GalleryData {
    coverImages: {
        [projectId: string]: {
            [platform: string]: string;
        };
    };
    platformImages: {
        [projectId: string]: {
            [platform: string]: string[];
        };
    };
}

interface ProjectsData {
    projects: Array<{
        id: string;
        name: string;
        platform: string;
        coverImages?: { [platform: string]: string };
        platformImages?: { [platform: string]: string[] };
    }>;
}

interface GalleryImage {
    id: string;
    imageUrl: string;
    platform: string;
}

interface ProjectPlatformCard {
    projectId: string;
    projectName: string;
    platform: string;
    coverImage: string | null;
    imageCount: number;
}

export default function Gallery() {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [selectedProjectPlatform, setSelectedProjectPlatform] = useState<string | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
    const { data: galleryData, loading: galleryLoading } = useFirestoreData<GalleryData>("gallery");
    const { data: projectsData, loading: projectsLoading } = useFirestoreData<ProjectsData>("projects");
    const { isMaximized } = useWindowState();

    const loading = galleryLoading || projectsLoading;

    const platformIcons: { [key: string]: any } = {
        All: Briefcase,
        Mobile: Smartphone,
        Desktop: Monitor,
        Web: Globe,
        "Cross-Platform": Layers,
    };

    // Get project-platform cards (separate card for each platform) - Same as Projects app
    const projectPlatformCards = useMemo(() => {
        if (!galleryData?.platformImages || !projectsData?.projects) return [];
        
        const cards: ProjectPlatformCard[] = [];
        
        if (selectedPlatform === "All") {
            // For "All" tab, expand projects with multiple platforms
            projectsData.projects.forEach(project => {
                const projectImages = galleryData.platformImages[project.id];
                if (!projectImages) return;
                
                // Add separate card for each platform that has images
                Object.entries(projectImages).forEach(([platform, images]) => {
                    if (images.length > 0) {
                        const coverImage = galleryData.coverImages?.[project.id]?.[platform] || images[0];
                        
                        cards.push({
                            projectId: project.id,
                            projectName: project.name,
                            platform,
                            coverImage,
                            imageCount: images.length
                        });
                    }
                });
            });
        } else {
            // For specific platform tabs, show only that platform
            projectsData.projects.forEach(project => {
                const projectImages = galleryData.platformImages[project.id];
                if (!projectImages || !projectImages[selectedPlatform]) return;
                
                const images = projectImages[selectedPlatform];
                if (images.length > 0) {
                    const coverImage = galleryData.coverImages?.[project.id]?.[selectedPlatform] || images[0];
                    
                    cards.push({
                        projectId: project.id,
                        projectName: project.name,
                        platform: selectedPlatform,
                        coverImage,
                        imageCount: images.length
                    });
                }
            });
        }
        
        return cards;
    }, [galleryData, projectsData, selectedPlatform]);

    // Get available platforms
    const availablePlatforms = useMemo(() => {
        if (!galleryData?.platformImages || !projectsData?.projects) return ["All"];
        
        const platforms = new Set<string>(["All"]);
        
        projectsData.projects.forEach((project) => {
            const projectImages = galleryData.platformImages[project.id];
            if (projectImages) {
                Object.keys(projectImages).forEach((platform) => {
                    if (projectImages[platform].length > 0) {
                        platforms.add(platform);
                    }
                });
            }
        });
        
        return Array.from(platforms);
    }, [galleryData, projectsData]);

    // No need for filteredCards - projectPlatformCards already handles filtering

    // Get images for selected project (filtered by platform if clicked from platform card)
    const projectImages = useMemo(() => {
        if (!selectedProject || !galleryData?.platformImages?.[selectedProject]) return [];
        
        const images: GalleryImage[] = [];
        const projectPlatformImages = galleryData.platformImages[selectedProject];
        
        // If a specific platform was selected (clicked from platform card), show only that platform's images
        if (selectedProjectPlatform) {
            const platformUrls = projectPlatformImages[selectedProjectPlatform];
            if (Array.isArray(platformUrls)) {
                platformUrls.forEach((url, idx) => {
                    images.push({
                        id: `${selectedProject}-${selectedProjectPlatform}-${idx}`,
                        imageUrl: url,
                        platform: selectedProjectPlatform
                    });
                });
            }
        } else {
            // Show all platforms (fallback, shouldn't happen normally)
            Object.entries(projectPlatformImages).forEach(([platform, urls]) => {
                if (Array.isArray(urls)) {
                    urls.forEach((url, idx) => {
                        images.push({
                            id: `${selectedProject}-${platform}-${idx}`,
                            imageUrl: url,
                            platform
                        });
                    });
                }
            });
        }
        
        return images;
    }, [selectedProject, selectedProjectPlatform, galleryData]);

    // Get selected project details
    const currentProject = useMemo(() => {
        if (!selectedProject || !projectsData?.projects) return null;
        return projectsData.projects.find(p => p.id === selectedProject);
    }, [selectedProject, projectsData]);

    // Modal navigation handlers
    const handleNextImage = () => {
        if (selectedImageIndex !== null && selectedImageIndex < projectImages.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        } else if (selectedImageIndex === projectImages.length - 1) {
            // Loop back to first image
            setSelectedImageIndex(0);
        }
    };

    const handlePreviousImage = () => {
        if (selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        } else if (selectedImageIndex === 0) {
            // Loop to last image
            setSelectedImageIndex(projectImages.length - 1);
        }
    };

    // If image is selected, show modal
    if (selectedImageIndex !== null && projectImages[selectedImageIndex]) {
        return (
            <ImageModal
                imageSrc={projectImages[selectedImageIndex].imageUrl}
                onClose={() => setSelectedImageIndex(null)}
                onNext={handleNextImage}
                onPrevious={handlePreviousImage}
                hasNext={projectImages.length > 1}
                hasPrevious={projectImages.length > 1}
            />
        );
    }

    if (loading) {
        return (
            <div className="h-full bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading gallery...</p>
                </div>
            </div>
        );
    }

    if (!galleryData || !projectsData) return null;

    // Project Detail View
    if (selectedProject && currentProject) {
        return (
            <div className="h-full overflow-y-auto no-scrollbar bg-background">
                {/* Header with Back Button */}
                <div className="border-b bg-muted/20 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setSelectedProject(null);
                                setSelectedProjectPlatform(null);
                            }}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <FolderOpen className="w-6 h-6 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">
                                {currentProject.name}
                                {selectedProjectPlatform && (
                                    <span className="text-lg text-muted-foreground ml-2">- {selectedProjectPlatform}</span>
                                )}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {projectImages.length} {projectImages.length === 1 ? 'image' : 'images'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Images Masonry Grid */}
                <div className="p-4 sm:p-6">
                    {projectImages.length > 0 ? (
                        <div className={`columns-2 ${isMaximized ? 'sm:columns-3 lg:columns-4' : 'sm:columns-3'} gap-4 sm:gap-6 space-y-4 sm:space-y-6`}>
                            {projectImages.map((image, index) => (
                                <div key={image.id} className="break-inside-avoid">
                                    <div
                                        className="group relative rounded-xl overflow-hidden cursor-pointer transition-all bg-card border-2 border-border hover:border-primary hover:shadow-2xl"
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <img
                                            src={image.imageUrl}
                                            alt={`${image.platform} screenshot`}
                                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />

                                        {/* Platform Badge */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <span className="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-black/70 text-white">
                                                {image.platform}
                                            </span>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <div className="text-white">
                                                <p className="font-bold text-sm">{image.platform}</p>
                                                <p className="text-xs text-white/80">Click to view full size</p>
                                            </div>
                                        </div>

                                        {/* Hover Effect */}
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-semibold">No images in this project</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Projects List View (Platform-based cards)
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background">
            {/* Header */}
            <div className="border-b bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-3">
                    <ImageIcon className="w-6 h-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Gallery</h1>
                        <p className="text-sm text-muted-foreground">
                            Browse project images by platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Platform Tabs */}
            {availablePlatforms.length > 1 && (
                <div className="border-b bg-muted/10 px-6 py-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {availablePlatforms.map((platform) => {
                            const Icon = platformIcons[platform] || Briefcase;
                            const isActive = selectedPlatform === platform;
                            
                            return (
                                <button
                                    key={platform}
                                    onClick={() => setSelectedPlatform(platform)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {platform}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Platform-based Project Cards Grid */}
            <div className="p-4 sm:p-6">
                {projectPlatformCards.length > 0 ? (
                    <div className={`columns-2 ${isMaximized ? 'sm:columns-3 lg:columns-4' : 'sm:columns-3'} gap-4 sm:gap-6 space-y-4 sm:space-y-6`}>
                        {projectPlatformCards.map((card, index) => {
                            // Determine aspect ratio based on platform
                            const aspectRatio = card.platform === "Mobile" ? "aspect-[9/16]" : "aspect-video";
                            
                            return (
                            <div key={`${card.projectId}-${card.platform}-${index}`} className="break-inside-avoid">
                                <button
                                    onClick={() => {
                                        setSelectedProject(card.projectId);
                                        setSelectedProjectPlatform(card.platform);
                                    }}
                                    className="group relative bg-card border-2 rounded-xl overflow-hidden text-left transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 active:scale-[0.98] w-full"
                                >
                                    {/* Cover Image with dynamic aspect ratio */}
                                    <div className={`relative w-full ${aspectRatio} bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden`}>
                                        {card.coverImage ? (
                                            <img
                                                src={card.coverImage}
                                                alt={`${card.projectName} - ${card.platform}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FolderOpen className="w-12 h-12 text-primary/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                        {/* Platform Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-primary/90 text-primary-foreground flex items-center gap-1.5">
                                                {platformIcons[card.platform] && 
                                                    (() => {
                                                        const Icon = platformIcons[card.platform];
                                                        return <Icon className="w-3 h-3" />;
                                                    })()
                                                }
                                                {card.platform}
                                            </span>
                                        </div>

                                        {/* Image Count Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-black/70 text-white">
                                                {card.imageCount} {card.imageCount === 1 ? 'image' : 'images'}
                                            </span>
                                        </div>

                                        {/* Project Name Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors">
                                                {card.projectName}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </button>
                            </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-semibold">No projects with images</p>
                        <p className="text-sm">Upload project screenshots to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
