import { useState, useMemo } from "react";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDetail } from "./components/ProjectDetail";
import { Project } from "./types";
import { Briefcase, Monitor, Smartphone, Globe, Layers } from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { useWindowState } from "@/hooks/useWindowState";

interface ProjectsData {
    projects: Project[];
}

export default function Projects() {
    const { data, loading } = useFirestoreData<ProjectsData>("projects");
    const [selectedProject, setSelectedProject] = useState<{ project: Project; platform: string } | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
    const { isMaximized } = useWindowState();

    // Get all available platforms from projects
    const availablePlatforms = useMemo(() => {
        if (!data?.projects) return ["All"];

        const platforms = new Set<string>(["All"]);
        
        data.projects.forEach((project) => {
            if (project.coverImages && Object.keys(project.coverImages).length > 0) {
                Object.keys(project.coverImages).forEach((platform) => {
                    platforms.add(platform);
                });
            } else if (project.platform) {
                platforms.add(project.platform);
            }
        });

        return Array.from(platforms);
    }, [data]);

    // Filter projects by selected platform
    const filteredProjects = useMemo(() => {
        if (!data?.projects) return [];
        
        if (selectedPlatform === "All") {
            // For "All" tab, expand projects with multiple platforms
            const expandedProjects: Array<{ project: Project; platform: string }> = [];
            
            data.projects.forEach((project) => {
                if (project.coverImages && Object.keys(project.coverImages).length > 0) {
                    // Add separate card for each platform
                    Object.keys(project.coverImages).forEach((platform) => {
                        expandedProjects.push({ project, platform });
                    });
                } else {
                    // Single platform project
                    expandedProjects.push({ project, platform: project.platform });
                }
            });
            
            return expandedProjects;
        }

        // For specific platform tabs, filter normally
        return data.projects
            .filter((project) => {
                if (project.coverImages && project.coverImages[selectedPlatform]) {
                    return true;
                }
                return project.platform === selectedPlatform;
            })
            .map((project) => ({ project, platform: selectedPlatform }));
    }, [data, selectedPlatform]);

    const platformIcons: { [key: string]: any } = {
        All: Briefcase,
        Mobile: Smartphone,
        Desktop: Monitor,
        Web: Globe,
        "Cross-Platform": Layers,
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    if (selectedProject) {
        return (
            <ProjectDetail
                project={selectedProject.project}
                platform={selectedProject.platform}
                onBack={() => setSelectedProject(null)}
            />
        );
    }

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-background">
            {/* Header */}
            <div className="border-b bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Projects</h1>
                        <p className="text-sm text-muted-foreground">
                            Real projects showcasing development expertise
                        </p>
                    </div>
                </div>
            </div>

            {/* Platform Tabs */}
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

            {/* Projects Grid */}
            <div className="p-4 sm:p-6">
                {filteredProjects.length > 0 ? (
                    <div className={`columns-2 ${isMaximized ? 'sm:columns-3 lg:columns-4' : 'sm:columns-3'} gap-4 sm:gap-6 space-y-4 sm:space-y-6`}>
                        {filteredProjects.map((item, index) => (
                            <div key={`${item.project.id}-${item.platform}-${index}`} className="break-inside-avoid">
                                <ProjectCard
                                    project={item.project}
                                    platform={item.platform}
                                    onClick={() => setSelectedProject({ project: item.project, platform: item.platform })}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No projects found for {selectedPlatform}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
