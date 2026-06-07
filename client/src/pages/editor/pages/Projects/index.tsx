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
        <div className="grid grid-cols-[1fr_380px] gap-6">
            <div className="space-y-4">
                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <Folder className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Your Projects</h3>
                                <p className="text-xs text-zinc-500">{data.projects.projects.length} project{data.projects.projects.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <JsonImportDialog data={data} setData={setData} />
                            <button onClick={handlers.addProject} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center gap-2">
                                <Plus className="w-3 h-3" />
                                Add Project
                            </button>
                        </div>
                    </div>
                </div>

                {data.projects.projects.length === 0 ? (
                    <div className="bg-white/[0.03] rounded-2xl border border-dashed border-white/10 p-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Folder className="w-7 h-7 text-zinc-600" />
                        </div>
                        <h4 className="text-base font-bold text-white mb-2">No projects yet</h4>
                        <p className="text-sm text-zinc-500 mb-5">Click "Add Project" to showcase your work</p>
                        <button onClick={handlers.addProject} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-medium rounded-xl border border-white/10 transition-all inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Your First Project
                        </button>
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
            <div className="space-y-4">
                <StatsCard data={data} />
            </div>
        </div>
    );
}
