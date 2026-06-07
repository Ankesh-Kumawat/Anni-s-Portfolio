import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, Check, Trash2, Image as ImageIcon, Star } from "lucide-react";
import type { EditorData } from "../../types";
import { ProjectForm } from "./ProjectForm";

interface ProjectCardProps {
    project: any;
    index: number;
    data: EditorData;
    isExpanded: boolean;
    onToggleExpand: () => void;
    handlers: any;
    customTech: { [key: number]: string };
    setCustomTech: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
    selectedCategory: { [key: number]: string };
    setSelectedCategory: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
    techStacks: { [key: string]: string[] };
    techStacksLoading: boolean;
}

export function ProjectCard({
    project,
    index,
    data,
    isExpanded,
    onToggleExpand,
    handlers,
    customTech,
    setCustomTech,
    selectedCategory,
    setSelectedCategory,
    techStacks,
    techStacksLoading
}: ProjectCardProps) {
    const isComplete = !!(project.name && project.tagline && project.description);

    return (
        <div className="editor-project-card bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
            {/* Project Header */}
            <div
                className="p-4 cursor-pointer hover:bg-muted transition-colors"
                onClick={onToggleExpand}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="editor-work-icon flex-shrink-0">
                            <Folder className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-bold text-foreground text-[15px]">
                                    {project.name || `Project #${index + 1}`}
                                </h4>
                                {isComplete && (
                                    <Badge className="bg-primary/10 text-primary border-primary h-5 text-[10px]">
                                        <Check className="w-3 h-3 mr-1" />
                                        Complete
                                    </Badge>
                                )}
                                <Badge variant="outline" className="h-5 text-[10px]">{project.status}</Badge>
                                <Badge variant="outline" className="h-5 text-[10px]">{project.platform}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
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
                            handlers.removeProject(index);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <ProjectForm
                    project={project}
                    index={index}
                    data={data}
                    handlers={handlers}
                    customTech={customTech}
                    setCustomTech={setCustomTech}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    techStacks={techStacks}
                    techStacksLoading={techStacksLoading}
                />
            )}
        </div>
    );
}
