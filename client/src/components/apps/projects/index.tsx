import { useState, useEffect, useRef } from "react";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDetail } from "./components/ProjectDetail";
import { Project } from "./types";
import { Briefcase } from "lucide-react";

interface ProjectsData {
    projects: Project[];
}

export default function Projects() {
    const [data, setData] = useState<ProjectsData | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Load projects from JSON
    useEffect(() => {
        fetch(`/data/projects.json?t=${Date.now()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return null;

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
            <div className="p-4 sm:p-6 h-full overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                    {data.projects.map((project) => (
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
