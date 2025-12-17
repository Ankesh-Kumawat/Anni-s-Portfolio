import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Sparkles, Check, Upload, ExternalLink, Github, Globe, Folder, Image as ImageIcon, Trash2, Star, GripVertical } from "lucide-react";
import type { StepProps } from "../types";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TECH_STACK_CATEGORIES = {
    "Frontend": ["React", "Vue", "Angular", "Next.js", "Svelte", "TypeScript", "JavaScript", "HTML", "CSS", "TailwindCSS", "Sass", "Bootstrap"],
    "Backend": ["Node.js", "Python", "Java", "PHP", "Ruby", "Go", "Express", "Django", "Spring Boot", "Laravel", "FastAPI", ".NET"],
    "Mobile": ["Flutter", "React Native", "Swift", "Kotlin", "Android", "iOS", "Expo", "Ionic"],
    "Database": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase", "SQLite", "DynamoDB", "Cassandra"],
    "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "GitHub Actions", "Vercel", "Netlify", "Heroku"],
    "Tools": ["Git", "VS Code", "Figma", "Postman", "Webpack", "Vite", "npm", "yarn", "Babel"],
    "Other": ["GraphQL", "REST API", "WebSocket", "Socket.io", "Jest", "Testing", "Agile", "Scrum"]
};

const STATUS_OPTIONS = ["Active", "In Development", "Completed", "Rebuilding", "Archived"];
const PLATFORM_OPTIONS = ["Web", "Mobile", "Desktop", "Cross-Platform", "Backend", "Full Stack"];

export default function Step4Projects({ data, setData }: StepProps) {
    const [expandedProject, setExpandedProject] = useState<number | null>(null);
    const [customTech, setCustomTech] = useState<{ [key: number]: string }>({});
    const [selectedCategory, setSelectedCategory] = useState<{ [key: number]: string }>({});

    const addProject = () => {
        setData((prev) => ({
            ...prev,
            projects: {
                projects: [
                    ...prev.projects.projects,
                    {
                        id: `project-${Date.now()}`,
                        name: "",
                        tagline: "",
                        description: "",
                        status: "In Development",
                        platform: "Web",
                        techStack: [],
                        overview: "",
                        problem: "",
                        solution: "",
                        outcome: "",
                        features: [],
                        architecture: {
                            structure: "",
                            dataHandling: "",
                            scalability: "",
                            performance: ""
                        },
                        challenges: [],
                        images: [],
                        github: "",
                        liveDemo: ""
                    }
                ]
            }
        }));
        setExpandedProject(data.projects.projects.length);
    };

    const removeProject = (index: number) => {
        setData((prev) => ({
            ...prev,
            projects: {
                projects: prev.projects.projects.filter((_, i) => i !== index)
            }
        }));
        if (expandedProject === index) setExpandedProject(null);
    };

    const updateProject = (index: number, field: string, value: any) => {
        setData((prev) => ({
            ...prev,
            projects: {
                projects: prev.projects.projects.map((project, i) =>
                    i === index ? { ...project, [field]: value } : project
                )
            }
        }));
    };

    const toggleTechStack = (index: number, tech: string) => {
        const project = data.projects.projects[index];
        if (project.techStack.includes(tech)) {
            removeTechStack(index, tech);
        } else {
            updateProject(index, "techStack", [...project.techStack, tech]);
        }
    };

    const addTechStack = (index: number, tech: string) => {
        const project = data.projects.projects[index];
        if (tech && !project.techStack.includes(tech)) {
            updateProject(index, "techStack", [...project.techStack, tech]);
        }
    };

    const addCustomTech = (index: number) => {
        const tech = customTech[index]?.trim();
        if (tech) {
            addTechStack(index, tech);
            setCustomTech({ ...customTech, [index]: "" });
        }
    };

    const removeTechStack = (index: number, tech: string) => {
        const project = data.projects.projects[index];
        updateProject(index, "techStack", project.techStack.filter(t => t !== tech));
    };

    const togglePlatform = (index: number, platform: string) => {
        const project = data.projects.projects[index];
        const platforms = project.platform.split(", ").filter(p => p);

        if (platforms.includes(platform)) {
            // Remove platform
            const newPlatforms = platforms.filter(p => p !== platform);
            updateProject(index, "platform", newPlatforms.join(", ") || "Web");
        } else {
            // Add platform
            updateProject(index, "platform", [...platforms, platform].join(", "));
        }
    };

    const isPlatformSelected = (index: number, platform: string) => {
        const project = data.projects.projects[index];
        return project.platform.split(", ").includes(platform);
    };

    const addFeature = (index: number) => {
        const project = data.projects.projects[index];
        updateProject(index, "features", [
            ...project.features,
            { title: "", description: "" }
        ]);
    };

    const updateFeature = (projectIndex: number, featureIndex: number, field: string, value: string) => {
        const project = data.projects.projects[projectIndex];
        const updatedFeatures = project.features.map((feature, i) =>
            i === featureIndex ? { ...feature, [field]: value } : feature
        );
        updateProject(projectIndex, "features", updatedFeatures);
    };

    const removeFeature = (projectIndex: number, featureIndex: number) => {
        const project = data.projects.projects[projectIndex];
        updateProject(projectIndex, "features", project.features.filter((_, i) => i !== featureIndex));
    };

    const addChallenge = (index: number) => {
        const project = data.projects.projects[index];
        updateProject(index, "challenges", [
            ...project.challenges,
            { challenge: "", solution: "", learning: "" }
        ]);
    };

    const updateChallenge = (projectIndex: number, challengeIndex: number, field: string, value: string) => {
        const project = data.projects.projects[projectIndex];
        const updatedChallenges = project.challenges.map((challenge, i) =>
            i === challengeIndex ? { ...challenge, [field]: value } : challenge
        );
        updateProject(projectIndex, "challenges", updatedChallenges);
    };

    const removeChallenge = (projectIndex: number, challengeIndex: number) => {
        const project = data.projects.projects[projectIndex];
        updateProject(projectIndex, "challenges", project.challenges.filter((_, i) => i !== challengeIndex));
    };

    const handleImageUpload = (projectIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const project = data.projects.projects[projectIndex];

        // No limit on images
        const filesToProcess = files;
        let processedCount = 0;
        const newImages: string[] = [];
        const newAssets: any[] = [];

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const preview = reader.result as string;
                const assetPath = `/assets/projects/${project.id}/${file.name}`;
                newImages.push(assetPath); // Store /assets/ path instead of data URL
                newAssets.push({
                    file,
                    path: `projects/${project.id}/${file.name}`,
                    preview // Keep preview for editor display
                });

                processedCount++;

                // Update state only when all files are processed
                if (processedCount === filesToProcess.length) {
                    setData((prev) => ({
                        ...prev,
                        projects: {
                            projects: prev.projects.projects.map((proj, i) =>
                                i === projectIndex
                                    ? { ...proj, images: [...proj.images, ...newImages] }
                                    : proj
                            )
                        },
                        assets: {
                            ...prev.assets,
                            images: [...prev.assets.images, ...newAssets]
                        },
                        // Auto-sync to gallery
                        gallery: {
                            ...prev.gallery,
                            folders: prev.gallery.folders.length > 0 ? prev.gallery.folders.map(folder => {
                                if (folder.id === "projects") {
                                    return {
                                        ...folder,
                                        children: prev.projects.projects.map(p => ({
                                            id: p.id,
                                            name: p.name || "Untitled Project",
                                            type: "folder" as const,
                                            coverImage: p.images[0] || "",
                                            children: p.images.map((path, idx) => ({
                                                id: `${p.id}-img-${idx}`,
                                                name: `Screenshot ${idx + 1}`,
                                                type: "image" as const,
                                                imageUrl: path
                                            }))
                                        }))
                                    };
                                }
                                return folder;
                            }) : [{
                                id: "projects",
                                name: "Projects",
                                type: "folder" as const,
                                coverImage: "",
                                children: prev.projects.projects.map(p => ({
                                    id: p.id,
                                    name: p.name || "Untitled Project",
                                    type: "folder" as const,
                                    coverImage: p.images[0] || "",
                                    children: p.images.map((path, idx) => ({
                                        id: `${p.id}-img-${idx}`,
                                        name: `Screenshot ${idx + 1}`,
                                        type: "image" as const,
                                        imageUrl: path
                                    }))
                                }))
                            }]
                        }
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (projectIndex: number, imageIndex: number) => {
        const project = data.projects.projects[projectIndex];
        const updatedImages = project.images.filter((_, i) => i !== imageIndex);

        // Update project images and sync to gallery
        setData((prev) => {
            const updatedProjects = prev.projects.projects.map((proj, i) =>
                i === projectIndex ? { ...proj, images: updatedImages } : proj
            );

            return {
                ...prev,
                projects: {
                    projects: updatedProjects
                },
                // Sync to gallery with ALL images
                gallery: {
                    ...prev.gallery,
                    folders: prev.gallery.folders.length > 0 ? prev.gallery.folders.map(folder => {
                        if (folder.id === "projects") {
                            return {
                                ...folder,
                                children: updatedProjects.map(p => ({
                                    id: p.id,
                                    name: p.name || "Untitled Project",
                                    type: "folder" as const,
                                    coverImage: p.images[0] || "",
                                    children: p.images.map((path, idx) => ({
                                        id: `${p.id}-img-${idx}`,
                                        name: `Screenshot ${idx + 1}`,
                                        type: "image" as const,
                                        imageUrl: path
                                    }))
                                }))
                            };
                        }
                        return folder;
                    }) : [{
                        id: "projects",
                        name: "Projects",
                        type: "folder" as const,
                        coverImage: "",
                        children: updatedProjects.map(p => ({
                            id: p.id,
                            name: p.name || "Untitled Project",
                            type: "folder" as const,
                            coverImage: p.images[0] || "",
                            children: p.images.map((path, idx) => ({
                                id: `${p.id}-img-${idx}`,
                                name: `Screenshot ${idx + 1}`,
                                type: "image" as const,
                                imageUrl: path
                            }))
                        }))
                    }]
                }
            };
        });
    };

    const handleDragEnd = (projectIndex: number, result: any) => {
        if (!result.destination) return;

        const project = data.projects.projects[projectIndex];
        const items = Array.from(project.images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update project images and sync to gallery
        setData((prev) => {
            const updatedProjects = prev.projects.projects.map((proj, i) =>
                i === projectIndex ? { ...proj, images: items } : proj
            );

            return {
                ...prev,
                projects: {
                    projects: updatedProjects
                },
                // Sync to gallery with ALL images
                gallery: {
                    ...prev.gallery,
                    folders: prev.gallery.folders.length > 0 ? prev.gallery.folders.map(folder => {
                        if (folder.id === "projects") {
                            return {
                                ...folder,
                                children: updatedProjects.map(p => ({
                                    id: p.id,
                                    name: p.name || "Untitled Project",
                                    type: "folder" as const,
                                    coverImage: p.images[0] || "",
                                    children: p.images.map((path, idx) => ({
                                        id: `${p.id}-img-${idx}`,
                                        name: `Screenshot ${idx + 1}`,
                                        type: "image" as const,
                                        imageUrl: path
                                    }))
                                }))
                            };
                        }
                        return folder;
                    }) : [{
                        id: "projects",
                        name: "Projects",
                        type: "folder" as const,
                        coverImage: "",
                        children: updatedProjects.map(p => ({
                            id: p.id,
                            name: p.name || "Untitled Project",
                            type: "folder" as const,
                            coverImage: p.images[0] || "",
                            children: p.images.map((path, idx) => ({
                                id: `${p.id}-img-${idx}`,
                                name: `Screenshot ${idx + 1}`,
                                type: "image" as const,
                                imageUrl: path
                            }))
                        }))
                    }]
                }
            };
        });
    };

    const setCoverImage = (projectIndex: number, imageIndex: number) => {
        const project = data.projects.projects[projectIndex];
        const items = Array.from(project.images);
        const [coverImage] = items.splice(imageIndex, 1);
        items.unshift(coverImage); // Move to first position

        // Update project images and sync to gallery
        setData((prev) => {
            const updatedProjects = prev.projects.projects.map((proj, i) =>
                i === projectIndex ? { ...proj, images: items } : proj
            );

            return {
                ...prev,
                projects: {
                    projects: updatedProjects
                },
                // Sync to gallery with ALL images
                gallery: {
                    ...prev.gallery,
                    folders: prev.gallery.folders.length > 0 ? prev.gallery.folders.map(folder => {
                        if (folder.id === "projects") {
                            return {
                                ...folder,
                                children: updatedProjects.map(p => ({
                                    id: p.id,
                                    name: p.name || "Untitled Project",
                                    type: "folder" as const,
                                    coverImage: p.images[0] || "",
                                    children: p.images.map((path, idx) => ({
                                        id: `${p.id}-img-${idx}`,
                                        name: `Screenshot ${idx + 1}`,
                                        type: "image" as const,
                                        imageUrl: path
                                    }))
                                }))
                            };
                        }
                        return folder;
                    }) : [{
                        id: "projects",
                        name: "Projects",
                        type: "folder" as const,
                        coverImage: "",
                        children: updatedProjects.map(p => ({
                            id: p.id,
                            name: p.name || "Untitled Project",
                            type: "folder" as const,
                            coverImage: p.images[0] || "",
                            children: p.images.map((path, idx) => ({
                                id: `${p.id}-img-${idx}`,
                                name: `Screenshot ${idx + 1}`,
                                type: "image" as const,
                                imageUrl: path
                            }))
                        }))
                    }]
                }
            };
        });
    };

    const completionPercentage = () => {
        if (data.projects.projects.length === 0) return 0;
        const totalFields = data.projects.projects.length * 5; // name, tagline, description, status, platform
        const filledFields = data.projects.projects.reduce((acc, project) => {
            let count = 0;
            if (project.name) count++;
            if (project.tagline) count++;
            if (project.description) count++;
            if (project.status) count++;
            if (project.platform) count++;
            return acc + count;
        }, 0);
        return Math.round((filledFields / totalFields) * 100);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Projects</h2>
                        <p className="text-muted-foreground text-lg">Showcase your best work and achievements</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2 border">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold text-primary">
                                {completionPercentage()}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Info Notice */}
            <div className="mb-8 p-6 bg-card border-2 border-primary/30 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Folder className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <p className="text-base font-bold text-foreground">Optional Section - Showcase Your Work</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Add unlimited images per project. Upload screenshots, mockups, and demos to showcase your work.
                    </p>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[1fr_380px] gap-8">
                {/* Left Column - Projects */}
                <div className="space-y-6">
                    {/* Add Project Button */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Folder className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Your Projects</h3>
                                    <p className="text-sm text-muted-foreground">{data.projects.projects.length} project{data.projects.projects.length !== 1 ? 's' : ''} added</p>
                                </div>
                            </div>
                            <Button onClick={addProject} type="button" size="lg" className="gap-2 px-6">
                                <Plus className="w-4 h-4" />
                                Add Project
                            </Button>
                        </div>
                    </div>

                    {/* Projects List */}
                    {data.projects.projects.length === 0 ? (
                        <div className="bg-card rounded-2xl p-12 border-2 border-dashed border text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <Folder className="w-8 h-8 text-muted-foreground/60" />
                            </div>
                            <h4 className="text-lg font-bold text-foreground mb-2">No projects yet</h4>
                            <p className="text-muted-foreground mb-6">Click "Add Project" to showcase your work</p>
                            <Button onClick={addProject} type="button" variant="outline" size="lg" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Your First Project
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {data.projects.projects.map((project, index) => {
                                const isExpanded = expandedProject === index;
                                const isComplete = !!(project.name && project.tagline && project.description);

                                return (
                                    <div key={project.id} className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                                        {/* Project Header */}
                                        <div
                                            className="p-6 cursor-pointer hover:bg-muted transition-colors"
                                            onClick={() => setExpandedProject(isExpanded ? null : index)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                                                        <Folder className="w-6 h-6 text-primary-foreground" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-bold text-foreground text-lg">
                                                                {project.name || `Project #${index + 1}`}
                                                            </h4>
                                                            {isComplete && (
                                                                <Badge className="bg-primary/10 text-primary border-primary">
                                                                    <Check className="w-3 h-3 mr-1" />
                                                                    Complete
                                                                </Badge>
                                                            )}
                                                            <Badge variant="outline">{project.status}</Badge>
                                                            <Badge variant="outline">{project.platform}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {project.tagline || "No tagline added"}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <ImageIcon className="w-4 h-4 text-muted-foreground/60" />
                                                                <span className="text-xs text-muted-foreground">
                                                                    {project.images.length} total
                                                                </span>
                                                            </div>
                                                            {project.images.length > 0 && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                                                    <span className="text-xs font-semibold text-primary">
                                                                        Top {Math.min(6, project.images.length)} in JSON
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeProject(index);
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="border-t bg-muted p-6 space-y-6">
                                                {/* Basic Info */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-semibold text-foreground">Project Name *</Label>
                                                        <Input
                                                            value={project.name}
                                                            onChange={(e) => updateProject(index, "name", e.target.value)}
                                                            placeholder="My Awesome Project"
                                                            className="h-11 text-base bg-card"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-semibold text-foreground">Tagline *</Label>
                                                        <Input
                                                            value={project.tagline}
                                                            onChange={(e) => updateProject(index, "tagline", e.target.value)}
                                                            placeholder="One-line description"
                                                            className="h-11 text-base bg-card"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-foreground">Description *</Label>
                                                    <Textarea
                                                        value={project.description}
                                                        onChange={(e) => updateProject(index, "description", e.target.value)}
                                                        placeholder="Brief project description..."
                                                        rows={3}
                                                        className="resize-none text-base bg-card"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-foreground">Status</Label>
                                                    <Select
                                                        value={project.status}
                                                        onValueChange={(value) => updateProject(index, "status", value)}
                                                    >
                                                        <SelectTrigger className="h-11 bg-card">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {STATUS_OPTIONS.map((status) => (
                                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Multi-Platform Selection */}
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-semibold text-foreground">Platform (Select Multiple)</Label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {PLATFORM_OPTIONS.map((platform) => {
                                                            const isSelected = isPlatformSelected(index, platform);
                                                            return (
                                                                <button
                                                                    key={platform}
                                                                    type="button"
                                                                    onClick={() => togglePlatform(index, platform)}
                                                                    className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${isSelected
                                                                        ? "border-primary bg-primary text-primary-foreground"
                                                                        : "border bg-card text-foreground hover:border-primary"
                                                                        }`}
                                                                >
                                                                    {isSelected && <Check className="w-4 h-4 inline mr-1" />}
                                                                    {platform}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {project.platform && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Selected: {project.platform}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Tech Stack with Chips */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-sm font-semibold text-foreground">Tech Stack</Label>
                                                        <Badge variant="secondary" className="text-sm">
                                                            {project.techStack.length} selected
                                                        </Badge>
                                                    </div>

                                                    {/* Category Tabs */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.keys(TECH_STACK_CATEGORIES).map((category) => (
                                                            <button
                                                                key={category}
                                                                type="button"
                                                                onClick={() => setSelectedCategory({ ...selectedCategory, [index]: category })}
                                                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${(selectedCategory[index] || "Frontend") === category
                                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                                    : "bg-muted text-foreground hover:bg-muted/80 border border"
                                                                    }`}
                                                            >
                                                                {category}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Tech Chips */}
                                                    <div className="border-2 border rounded-2xl p-5 bg-muted min-h-[160px]">
                                                        <div className="flex flex-wrap gap-2">
                                                            {TECH_STACK_CATEGORIES[
                                                                (selectedCategory[index] || "Frontend") as keyof typeof TECH_STACK_CATEGORIES
                                                            ].map((tech) => {
                                                                const isSelected = project.techStack.includes(tech);
                                                                return (
                                                                    <button
                                                                        key={tech}
                                                                        type="button"
                                                                        onClick={() => toggleTechStack(index, tech)}
                                                                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isSelected
                                                                            ? "bg-primary text-primary-foreground shadow-md"
                                                                            : "bg-card text-foreground border-2 border hover:border-primary hover:shadow-md"
                                                                            }`}
                                                                    >
                                                                        {isSelected && <Check className="w-4 h-4" />}
                                                                        {tech}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Custom Tech Input */}
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={customTech[index] || ""}
                                                            onChange={(e) => setCustomTech({ ...customTech, [index]: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    addCustomTech(index);
                                                                }
                                                            }}
                                                            placeholder="Add custom technology (e.g., Photoshop, Blender)"
                                                            className="h-11 text-base bg-card flex-1"
                                                        />
                                                        <Button
                                                            type="button"
                                                            onClick={() => addCustomTech(index)}
                                                            size="lg"
                                                            className="px-6"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add
                                                        </Button>
                                                    </div>

                                                    {/* Selected Tech Stack */}
                                                    {project.techStack.length > 0 && (
                                                        <div className="p-5 bg-primary/10 rounded-2xl border-2 border-primary">
                                                            <Label className="text-sm font-bold text-primary mb-3 block flex items-center gap-2">
                                                                <Check className="w-4 h-4" />
                                                                Selected Technologies ({project.techStack.length})
                                                            </Label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {project.techStack.map((tech) => (
                                                                    <Badge key={tech} className="gap-2 px-4 py-2 bg-card text-foreground border-2 border text-sm">
                                                                        {tech}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeTechStack(index, tech)}
                                                                            className="hover:text-destructive transition-colors"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Links */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                            <Github className="w-4 h-4" />
                                                            GitHub URL (Optional)
                                                        </Label>
                                                        <Input
                                                            value={project.github || ""}
                                                            onChange={(e) => updateProject(index, "github", e.target.value)}
                                                            placeholder="https://github.com/..."
                                                            className="h-11 text-base bg-card"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                            <Globe className="w-4 h-4" />
                                                            Live Demo (Optional)
                                                        </Label>
                                                        <Input
                                                            value={project.liveDemo || ""}
                                                            onChange={(e) => updateProject(index, "liveDemo", e.target.value)}
                                                            placeholder="https://..."
                                                            className="h-11 text-base bg-card"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Project Images (Unlimited) */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                            <ImageIcon className="w-4 h-4" />
                                                            Project Images
                                                        </Label>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-muted-foreground">{project.images.length} total</span>
                                                            {project.images.length > 0 && (
                                                                <Badge className="bg-primary/10 text-primary border-primary text-xs">
                                                                    <Star className="w-3 h-3 mr-1 fill-primary" />
                                                                    Top {Math.min(6, project.images.length)} in JSON
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <label className="cursor-pointer block">
                                                        <div className="border-2 border-dashed border rounded-xl p-6 bg-card hover:border-primary hover:bg-primary/10 transition-all text-center">
                                                            <Upload className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                                                            <p className="text-sm font-medium text-foreground">Click to upload images</p>
                                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each • Drag to reorder • First image is cover</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={(e) => handleImageUpload(index, e)}
                                                            className="hidden"
                                                        />
                                                    </label>

                                                    {project.images.length > 0 && (
                                                        <div className="space-y-3">
                                                            <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4">
                                                                <div className="flex items-start gap-3">
                                                                    <Star className="w-5 h-5 text-primary fill-primary flex-shrink-0 mt-0.5" />
                                                                    <div>
                                                                        <p className="text-sm font-bold text-primary">
                                                                            Drag to Reorder • Top 6 Images Saved to JSON
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                            First image = Cover Image • Drag images to arrange priority • Only top 6 will be in final portfolio
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <DragDropContext onDragEnd={(result) => handleDragEnd(index, result)}>
                                                                <Droppable droppableId={`project-images-${index}`} direction="horizontal">
                                                                    {(provided) => (
                                                                        <div
                                                                            {...provided.droppableProps}
                                                                            ref={provided.innerRef}
                                                                            className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto scrollbar-hide p-2"
                                                                        >
                                                                            {project.images.map((imagePath, imgIndex) => {
                                                                                // Find preview from assets
                                                                                const asset = data.assets.images.find(a =>
                                                                                    imagePath.includes(a.path)
                                                                                );
                                                                                const displaySrc = asset?.preview || imagePath;
                                                                                const isInTop6 = imgIndex < 6;
                                                                                const isCover = imgIndex === 0;

                                                                                return (
                                                                                    <Draggable key={imagePath} draggableId={imagePath} index={imgIndex}>
                                                                                        {(provided, snapshot) => (
                                                                                            <div
                                                                                                ref={provided.innerRef}
                                                                                                {...provided.draggableProps}
                                                                                                className={`relative group rounded-xl overflow-hidden border-4 transition-all ${snapshot.isDragging
                                                                                                    ? "border-primary shadow-2xl scale-105 z-50"
                                                                                                    : isInTop6
                                                                                                        ? "border-primary"
                                                                                                        : "border-muted"
                                                                                                    }`}
                                                                                            >
                                                                                                {/* Drag Handle */}
                                                                                                <div
                                                                                                    {...provided.dragHandleProps}
                                                                                                    className="absolute top-2 left-2 w-8 h-8 bg-black/70 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10 hover:bg-black/90 transition-colors"
                                                                                                >
                                                                                                    <GripVertical className="w-5 h-5 text-white" />
                                                                                                </div>

                                                                                                {/* Image */}
                                                                                                <img
                                                                                                    src={displaySrc}
                                                                                                    alt={`Project ${imgIndex + 1}`}
                                                                                                    className="w-full h-32 object-cover"
                                                                                                />

                                                                                                {/* Delete Button */}
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => removeImage(index, imgIndex)}
                                                                                                    className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10"
                                                                                                >
                                                                                                    <X className="w-5 h-5" />
                                                                                                </button>

                                                                                                {/* Cover Badge */}
                                                                                                {isCover && (
                                                                                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                                                                                        <Star className="w-3 h-3 fill-current" />
                                                                                                        COVER
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Position Badge */}
                                                                                                <div className={`absolute bottom-2 left-2 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${isInTop6
                                                                                                    ? "bg-primary text-primary-foreground"
                                                                                                    : "bg-black/70 text-white"
                                                                                                    }`}>
                                                                                                    #{imgIndex + 1}
                                                                                                    {isInTop6 && <Check className="w-3 h-3" />}
                                                                                                </div>

                                                                                                {/* In JSON Badge */}
                                                                                                {isInTop6 && (
                                                                                                    <div className="absolute bottom-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                                                                                                        IN JSON
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Not in JSON Badge */}
                                                                                                {!isInTop6 && (
                                                                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                                        <p className="text-white text-xs font-bold text-center px-2">
                                                                                                            Not in JSON<br />
                                                                                                            <span className="text-[10px]">Drag to top 6</span>
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        )}
                                                                                    </Draggable>
                                                                                );
                                                                            })}
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Droppable>
                                                            </DragDropContext>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column - Stats & Info */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
                        <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-foreground">Statistics</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary">
                                <span className="text-sm font-medium text-foreground">Total Projects</span>
                                <span className="text-2xl font-bold text-primary">{data.projects.projects.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary">
                                <span className="text-sm font-medium text-foreground">Complete</span>
                                <span className="text-2xl font-bold text-primary">
                                    {data.projects.projects.filter(p => p.name && p.tagline && p.description).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border">
                                <span className="text-sm font-medium text-foreground">Total Images</span>
                                <span className="text-2xl font-bold text-foreground">
                                    {data.projects.projects.reduce((acc, p) => acc + p.images.length, 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border-2 border-primary">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                    <span className="text-sm font-medium text-foreground">In JSON</span>
                                </div>
                                <span className="text-2xl font-bold text-primary">
                                    {data.projects.projects.reduce((acc, p) => acc + Math.min(6, p.images.length), 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <Star className="w-5 h-5 text-primary fill-primary" />
                            Image Management
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span><strong className="text-foreground">Upload unlimited</strong> images per project</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span><strong className="text-foreground">Drag to reorder</strong> - arrange priority</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span><strong className="text-foreground">First image</strong> = Cover image</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span><strong className="text-foreground">Top 6 images</strong> saved to JSON</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Images auto-sync to Gallery section</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
