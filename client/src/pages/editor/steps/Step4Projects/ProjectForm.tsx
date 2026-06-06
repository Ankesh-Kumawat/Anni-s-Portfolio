import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Check, Github, Globe, Loader2 } from "lucide-react";
import type { EditorData } from "../../types";
import { STATUS_OPTIONS, PLATFORM_OPTIONS } from "./constants";
import { ImageGallery } from "./ImageGallery";
import type { ProjectFormProps } from "./types";

export function ProjectForm({
    project,
    index,
    data,
    handlers,
    customTech,
    setCustomTech,
    selectedCategory,
    setSelectedCategory,
    techStacks,
    techStacksLoading
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
                <Label className="text-sm font-semibold text-foreground">Platform</Label>
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
                <Input
                    value={project.platform}
                    onChange={(e) => handlers.updateProject(index, "platform", e.target.value)}
                    placeholder="e.g. Web, Mobile, Desktop"
                    className="h-10 text-sm bg-card font-mono"
                />
                <p className="text-xs text-muted-foreground">
                    Type directly to edit or fix platform value
                </p>
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
                    {techStacksLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Loading...</span>
                        </div>
                    ) : (
                        Object.keys(techStacks).map((category) => (
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
                    ))
                    )}
                </div>

                {/* Tech Chips */}
                <div className="border-2 border rounded-2xl p-5 bg-muted min-h-[160px]">
                    {Object.keys(techStacks).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-base font-semibold mb-1">No Tech Stacks Available</p>
                            <p className="text-sm">Please upload tech stacks using the "Tech Stacks" button in the header</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {techStacks[selectedCategory[index] || "Frontend"]?.map((tech) => {
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
                    )}
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

            {/* Detailed Content (Optional) */}
            <div className="space-y-4 border-t pt-6">
                <Label className="text-base font-bold text-foreground">Detailed Content (Optional)</Label>
                <p className="text-xs text-muted-foreground">These fields will be shown in the project detail page</p>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Overview</Label>
                    <Textarea
                        value={project.overview || ""}
                        onChange={(e) => handlers.updateProject(index, "overview", e.target.value)}
                        placeholder="High-level overview of the project..."
                        rows={3}
                        className="resize-none text-base bg-card"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Problem</Label>
                    <Textarea
                        value={project.problem || ""}
                        onChange={(e) => handlers.updateProject(index, "problem", e.target.value)}
                        placeholder="What problem does this project solve?"
                        rows={3}
                        className="resize-none text-base bg-card"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Solution</Label>
                    <Textarea
                        value={project.solution || ""}
                        onChange={(e) => handlers.updateProject(index, "solution", e.target.value)}
                        placeholder="How did you solve it?"
                        rows={3}
                        className="resize-none text-base bg-card"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Outcome</Label>
                    <Textarea
                        value={project.outcome || ""}
                        onChange={(e) => handlers.updateProject(index, "outcome", e.target.value)}
                        placeholder="What was the result/impact?"
                        rows={3}
                        className="resize-none text-base bg-card"
                    />
                </div>
            </div>

            {/* Architecture (Optional) */}
            <div className="space-y-4 border-t pt-6">
                <Label className="text-base font-bold text-foreground">Architecture (Optional)</Label>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Structure</Label>
                        <Textarea
                            value={project.architecture?.structure || ""}
                            onChange={(e) => handlers.updateProject(index, "architecture", { ...project.architecture, structure: e.target.value })}
                            placeholder="System structure..."
                            rows={2}
                            className="resize-none text-base bg-card"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Data Handling</Label>
                        <Textarea
                            value={project.architecture?.dataHandling || ""}
                            onChange={(e) => handlers.updateProject(index, "architecture", { ...project.architecture, dataHandling: e.target.value })}
                            placeholder="How data is managed..."
                            rows={2}
                            className="resize-none text-base bg-card"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Scalability</Label>
                        <Textarea
                            value={project.architecture?.scalability || ""}
                            onChange={(e) => handlers.updateProject(index, "architecture", { ...project.architecture, scalability: e.target.value })}
                            placeholder="Scalability approach..."
                            rows={2}
                            className="resize-none text-base bg-card"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Performance</Label>
                        <Textarea
                            value={project.architecture?.performance || ""}
                            onChange={(e) => handlers.updateProject(index, "architecture", { ...project.architecture, performance: e.target.value })}
                            placeholder="Performance optimizations..."
                            rows={2}
                            className="resize-none text-base bg-card"
                        />
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-4 border-t pt-6">
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
