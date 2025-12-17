import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Sparkles, Check, Upload, ExternalLink, Github, Globe, Folder, Image as ImageIcon, Trash2 } from "lucide-react";
import type { StepProps } from "../types";
import { useState } from "react";

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
        updateProject(projectIndex, "images", project.images.filter((_, i) => i !== imageIndex));
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
                    <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-4 rounded-2xl border border-primary/30">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {completionPercentage()}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Info Notice */}
            <div className="mb-8 p-6 bg-card border-2 border-primary/30 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Folder className="w-5 h-5 text-white" />
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
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                        <Folder className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-bold text-foreground text-lg">
                                                                {project.name || `Project #${index + 1}`}
                                                            </h4>
                                                            {isComplete && (
                                                                <Badge className="bg-green-100 text-green-700 border-green-500/30">
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
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <ImageIcon className="w-4 h-4 text-muted-foreground/60" />
                                                            <span className="text-xs text-muted-foreground">
                                                                {project.images.length}/6 images
                                                            </span>
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
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="border-t bg-gradient-to-br from-muted/30 to-muted/50 p-6 space-y-6">
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
                                                                        ? "border-blue-500 bg-primary/10 text-primary"
                                                                        : "border bg-card text-foreground hover:border-blue-300"
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
                                                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                                                                    : "bg-muted text-foreground hover:bg-muted border border"
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
                                                                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                                                                            : "bg-card text-foreground border-2 border hover:border-purple-500 hover:shadow-md"
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
                                                        <div className="p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border-2 border-green-500/30">
                                                            <Label className="text-sm font-bold text-green-700 dark:text-green-400 mb-3 block flex items-center gap-2">
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
                                                                            className="hover:text-red-600 transition-colors"
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
                                                            Project Images (Unlimited)
                                                        </Label>
                                                        <span className="text-xs text-muted-foreground">{project.images.length} image{project.images.length !== 1 ? 's' : ''}</span>
                                                    </div>

                                                    <label className="cursor-pointer block">
                                                        <div className="border-2 border-dashed border rounded-xl p-6 bg-card hover:border-blue-400 hover:bg-primary/10 transition-all text-center">
                                                            <Upload className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                                                            <p className="text-sm font-medium text-foreground">Click to upload images</p>
                                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each • Upload as many as you want</p>
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
                                                            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                                                                <p className="text-xs text-primary font-medium">
                                                                    ✓ {project.images.length} image{project.images.length !== 1 ? 's' : ''} uploaded for this project
                                                                </p>
                                                            </div>
                                                            <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto scrollbar-hide p-2">
                                                                {project.images.map((imagePath, imgIndex) => {
                                                                    // Find preview from assets
                                                                    const asset = data.assets.images.find(a =>
                                                                        imagePath.includes(a.path)
                                                                    );
                                                                    const displaySrc = asset?.preview || imagePath;

                                                                    return (
                                                                        <div key={imgIndex} className="relative group">
                                                                            <img
                                                                                src={displaySrc}
                                                                                alt={`Project ${imgIndex + 1}`}
                                                                                className="w-full h-24 object-cover rounded-lg border-2 border"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeImage(index, imgIndex)}
                                                                                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                                                #{imgIndex + 1}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
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
                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/30">
                                <span className="text-sm font-medium text-primary">Total Projects</span>
                                <span className="text-2xl font-bold text-primary">{data.projects.projects.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-500/30">
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">Complete</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {data.projects.projects.filter(p => p.name && p.tagline && p.description).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <span className="text-sm font-medium text-purple-900">Total Images</span>
                                <span className="text-2xl font-bold text-purple-600">
                                    {data.projects.projects.reduce((acc, p) => acc + p.images.length, 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-6 border-2 border-primary/30">
                        <h4 className="font-bold text-foreground mb-3">💡 Quick Tips</h4>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Add unlimited images per project</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Upload multiple images at once</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Click project header to expand/collapse</span>
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











