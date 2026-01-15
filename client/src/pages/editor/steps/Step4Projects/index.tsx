import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Plus, Sparkles } from "lucide-react";
import type { StepProps } from "../../types";
import { ProjectCard } from "./ProjectCard";
import { StatsCard, HelpCard } from "./StatsCard";
import { useProjectHandlers } from "./useProjectHandlers";
import { useTechStacks } from "@/hooks/use-tech-stacks";

export default function Step4Projects({ data, setData }: StepProps) {
    const [expandedProject, setExpandedProject] = useState<number | null>(null);
    const [customTech, setCustomTech] = useState<{ [key: number]: string }>({});
    const [selectedCategory, setSelectedCategory] = useState<{ [key: number]: string }>({});
    const { techStacks, loading: techStacksLoading } = useTechStacks();

    const handlers = useProjectHandlers(data, setData);

    const completionPercentage = () => {
        if (data.projects.projects.length === 0) return 0;
        const totalFields = data.projects.projects.length * 5;
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
                            <Button onClick={handlers.addProject} type="button" size="lg" className="gap-2 px-6">
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
                            <Button onClick={handlers.addProject} type="button" variant="outline" size="lg" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Your First Project
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
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

                {/* Right Column - Stats & Info */}
                <div className="space-y-6">
                    <StatsCard data={data} />
                    <HelpCard />
                </div>
            </div>
        </div>
    );
}
