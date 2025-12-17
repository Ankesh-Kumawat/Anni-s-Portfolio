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
    const [columns, setColumns] = useState(2);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load projects from JSON
    useEffect(() => {
        fetch(`/data/projects.json?t=${Date.now()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    // Dynamically adjust columns based on container width
    useEffect(() => {
        const updateColumns = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;

            if (width < 640) {
                setColumns(1); // Mobile
            } else if (width < 1200) {
                setColumns(2); // Small window
            } else {
                setColumns(4); // Full screen
            }
        };

        updateColumns();
        const resizeObserver = new ResizeObserver(updateColumns);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
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
            <div ref={containerRef} className="p-4 sm:p-6 h-full overflow-y-auto no-scrollbar">
                <div
                    className="grid gap-3 sm:gap-4 w-full transition-all duration-300"
                    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                >
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
