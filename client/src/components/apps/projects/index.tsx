import { useState } from "react";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDetail } from "./components/ProjectDetail";
import { Project } from "./types";
import { Briefcase } from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";

interface ProjectsData {
    projects: Project[];
}

export default function Projects() {
    const { data, loading } = useFirestoreData<ProjectsData>("projects");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading projects...</p>
                </div>
            </div>
        );
    }

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
