import { useState, useEffect, useRef } from "react";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectDetail } from "./components/ProjectDetail";
import { PROJECTS } from "./data";
import { Project } from "./types";
import { Briefcase } from "lucide-react";

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [columns, setColumns] = useState(2);
    const containerRef = useRef<HTMLDivElement>(null);

    // Dynamically adjust columns based on container width
    useEffect(() => {
        const updateColumns = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;

            if (width < 600) {
                setColumns(1);
            } else if (width < 900) {
                setColumns(2);
            } else if (width < 1200) {
                setColumns(3);
            } else {
                setColumns(4);
            }
        };

        updateColumns();
        const resizeObserver = new ResizeObserver(updateColumns);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

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
            <div ref={containerRef} className="p-6 h-full overflow-y-auto no-scrollbar">
                <div
                    className="grid gap-4 w-full transition-all duration-300"
                    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                >
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
