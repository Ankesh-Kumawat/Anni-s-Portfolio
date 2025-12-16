import { useState } from "react";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDetail } from "./components/ProjectDetail";
import { PROJECTS } from "./data";
import { Project } from "./types";
import { Briefcase } from "lucide-react";

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    if (selectedProject) {
        return (
            <ProjectDetail
                project={selectedProject}
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

            {/* Projects Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                    {PROJECTS.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => setSelectedProject(project)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
