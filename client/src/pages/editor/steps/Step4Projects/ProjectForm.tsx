import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Check, Github, Globe } from "lucide-react";
import type { EditorData } from "../../types";
import { TECH_STACK_CATEGORIES, STATUS_OPTIONS, PLATFORM_OPTIONS } from "./constants";
import { ImageGallery } from "./ImageGallery";

interface ProjectFormProps {
    project: any;
    index: number;
    data: EditorData;
    handlers: any;
    customTech: { [key: number]: string };
    setCustomTech: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
    selectedCategory: { [key: number]: string };
    setSelectedCategory: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
}

export function ProjectForm({
    project,
    index,
    data,
    handlers,
    customTech,
    setCustomTech,
    selectedCategory,
    setSelectedCategory
}: ProjectFormProps) {
    return (
        <div className="border-t bg-muted p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Project Name *</Label>
                    <Input
                        value={project.name}
                        onChange={(e) => handlers.updateProject(index, "name", e.target.value)}
                        placeholder="My Awesome Project"
                        className="h-11 text-base bg-card"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Tagline *</Label>
                    <Input
                        value={project.tagline}
                        onChange={(e) => handlers.updateProject(index, "tagline", e.target.value)}
                        placeholder="One-line description"
                        className="h-11 text-base bg-card"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Description *</Label>
                <Textarea
                    value={project.description}
                    onChange={(e) => handlers.updateProject(index, "description", e.target.value)}
                    placeholder="Brief project description..."
                    rows={3}
                    className="resize-none text-base bg-card"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Status</Label>
                <Select
                    value={project.status}
                    onValueChange={(value) => handlers.updateProject(index, "status", value)}
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
                        const isSelected = handlers.isPlatformSelected(index, platform);
                        return (
                            <button
                                key={platform}
                                type="button"
                                onClick={() => handlers.togglePlatform(index, platform)}
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

            {/* Tech Stack */}
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
                                    onClick={() => handlers.toggleTechStack(index, tech)}
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
                                handlers.addCustomTech(index, customTech, setCustomTech);
                            }
                        }}
                        placeholder="Add custom technology (e.g., Photoshop, Blender)"
                        className="h-11 text-base bg-card flex-1"
                    />
                    <Button
                        type="button"
                        onClick={() => handlers.addCustomTech(index, customTech, setCustomTech)}
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
                            {project.techStack.map((tech: string) => (
                                <Badge key={tech} className="gap-2 px-4 py-2 bg-card text-foreground border-2 border text-sm">
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => handlers.removeTechStack(index, tech)}
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
                        onChange={(e) => handlers.updateProject(index, "github", e.target.value)}
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
                        onChange={(e) => handlers.updateProject(index, "liveDemo", e.target.value)}
                        placeholder="https://..."
                        className="h-11 text-base bg-card"
                    />
                </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery
                project={project}
                index={index}
                data={data}
                handlers={handlers}
            />
        </div>
    );
}
