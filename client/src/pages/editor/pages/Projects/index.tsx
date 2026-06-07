import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import type { StepProps } from "../../types";
import { ProjectCard } from "./ProjectCard";
import { StatsCard } from "./StatsCard";
import { useProjectHandlers } from "./useProjectHandlers";
import { useTechStacks } from "@/hooks/use-tech-stacks";
import { JsonImportDialog } from "./JsonImportDialog";

export default function ProjectsPage({ data, setData }: StepProps) {
    const [expandedProject, setExpandedProject] = useState<number | null>(null);
    const [customTech, setCustomTech] = useState<{ [key: number]: string }>({});
    const [selectedCategory, setSelectedCategory] = useState<{ [key: number]: string }>({});
    const { techStacks, loading: techStacksLoading } = useTechStacks();
    const handlers = useProjectHandlers(data, setData);

    return (
        <div className="editor-page-grid two">
            <div className="editor-page-main">
                <div className="editor-work-header">
                    <div className="editor-work-title">
                        <div className="editor-work-icon">
                            <Folder className="w-4 h-4" />
                        </div>
                        <div>
                            <h3>Project Workspace</h3>
                            <p>{data.projects.projects.length} project{data.projects.projects.length !== 1 ? 's' : ''} in the portfolio catalog</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <JsonImportDialog data={data} setData={setData} />
                        <Button onClick={handlers.addProject} size="sm" className="gap-2">
                            <Plus className="w-3.5 h-3.5" />
                            Add Project
                        </Button>
                    </div>
                </div>

                {data.projects.projects.length === 0 ? (
                    <div className="editor-empty-state">
                        <div className="editor-work-icon">
                            <Folder className="w-5 h-5" />
                        </div>
                        <h4>No projects yet</h4>
                        <p>Add a project to start building cards, gallery images, and tech-stack metadata.</p>
                        <Button onClick={handlers.addProject} variant="outline" size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Your First Project
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.projects.projects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                data={data}
                                isExpanded={expandedProject === index}
                                onToggleExpand={() => setExpandedProject(expandedProject === index ? null : index)}
                                handlers={handlers}
                                customTech={customTech}
                                setCustomTech={setCustomTech}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                techStacks={techStacks}
                                techStacksLoading={techStacksLoading}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="editor-page-side">
                <StatsCard data={data} />
            </div>
        </div>
    );
}
