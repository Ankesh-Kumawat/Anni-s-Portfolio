import { ProjectCard } from "./components/ProjectCard";
import { PROJECTS } from "./constants";

export default function Projects() {
    return (
        <div className="p-8 h-full overflow-y-auto no-scrollbar bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROJECTS.map((project, i) => (
                    <ProjectCard key={i} project={project} />
                ))}
            </div>
        </div>
    );
}
