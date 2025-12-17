import type { EditorData } from "../../types";

export function useProjectHandlers(data: EditorData, setData: React.Dispatch<React.SetStateAction<EditorData>>) {
    const syncGallery = (updatedProjects: any[]) => {
        return {
            folders: data.gallery.folders.length > 0 ? data.gallery.folders.map(folder => {
                if (folder.id === "projects") {
                    return {
                        ...folder,
                        children: updatedProjects.map(p => ({
                            id: p.id,
                            name: p.name || "Untitled Project",
                            type: "folder" as const,
                            coverImage: p.images[0] || "",
                            children: p.images.map((path: string, idx: number) => ({
                                id: `${p.id}-img-${idx}`,
                                name: `Screenshot ${idx + 1}`,
                                type: "image" as const,
                                imageUrl: path
                            }))
                        }))
                    };
                }
                return folder;
            }) : [{
                id: "projects",
                name: "Projects",
                type: "folder" as const,
                coverImage: "",
                children: updatedProjects.map(p => ({
                    id: p.id,
                    name: p.name || "Untitled Project",
                    type: "folder" as const,
                    coverImage: p.images[0] || "",
                    children: p.images.map((path: string, idx: number) => ({
                        id: `${p.id}-img-${idx}`,
                        name: `Screenshot ${idx + 1}`,
                        type: "image" as const,
                        imageUrl: path
                    }))
                }))
            }],
            directImages: data.gallery.directImages || []
        };
    };

    const addProject = () => {
        setData((prev) => ({
            ...prev,
            projects: {
                projects: [
                    ...prev.projects.projects,
                    {
                        id: `project-${Date.now()}`,
                        name: "",
                        tagline: "",
                        description: "",
                        status: "In Development",
                        platform: "Web",
                        techStack: [],
                        overview: "",
                        problem: "",
                        solution: "",
                        outcome: "",
                        features: [],
                        architecture: {
                            structure: "",
                            dataHandling: "",
                            scalability: "",
                            performance: ""
                        },
                        challenges: [],
                        images: [],
                        github: "",
                        liveDemo: ""
                    }
                ]
            }
        }));
    };

    const removeProject = (index: number) => {
        setData((prev) => ({
            ...prev,
            projects: {
                projects: prev.projects.projects.filter((_, i) => i !== index)
            }
        }));
    };

    const updateProject = (index: number, field: string, value: any) => {
        setData((prev) => ({
            ...prev,
            projects: {
                projects: prev.projects.projects.map((project, i) =>
                    i === index ? { ...project, [field]: value } : project
                )
            }
        }));
    };

    const handleImageUpload = (projectIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const project = data.projects.projects[projectIndex];

        const filesToProcess = files;
        let processedCount = 0;
        const newImages: string[] = [];
        const newAssets: any[] = [];

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const preview = reader.result as string;
                const assetPath = `/assets/projects/${project.id}/${file.name}`;
                newImages.push(assetPath);
                newAssets.push({
                    file,
                    path: `projects/${project.id}/${file.name}`,
                    preview
                });

                processedCount++;

                if (processedCount === filesToProcess.length) {
                    setData((prev) => {
                        const updatedProjects = prev.projects.projects.map((proj, i) =>
                            i === projectIndex
                                ? { ...proj, images: [...proj.images, ...newImages] }
                                : proj
                        );

                        return {
                            ...prev,
                            projects: { projects: updatedProjects },
                            assets: {
                                ...prev.assets,
                                images: [...prev.assets.images, ...newAssets]
                            },
                            gallery: syncGallery(updatedProjects)
                        };
                    });
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (projectIndex: number, imageIndex: number) => {
        setData((prev) => {
            const updatedProjects = prev.projects.projects.map((proj, i) =>
                i === projectIndex
                    ? { ...proj, images: proj.images.filter((_, idx) => idx !== imageIndex) }
                    : proj
            );

            return {
                ...prev,
                projects: { projects: updatedProjects },
                gallery: syncGallery(updatedProjects)
            };
        });
    };

    const handleDragEnd = (projectIndex: number, result: any) => {
        if (!result.destination) return;

        setData((prev) => {
            const project = prev.projects.projects[projectIndex];
            const items = Array.from(project.images);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedProjects = prev.projects.projects.map((proj, i) =>
                i === projectIndex ? { ...proj, images: items } : proj
            );

            return {
                ...prev,
                projects: { projects: updatedProjects },
                gallery: syncGallery(updatedProjects)
            };
        });
    };

    const toggleTechStack = (index: number, tech: string) => {
        const project = data.projects.projects[index];
        if (project.techStack.includes(tech)) {
            updateProject(index, "techStack", project.techStack.filter(t => t !== tech));
        } else {
            updateProject(index, "techStack", [...project.techStack, tech]);
        }
    };

    const addCustomTech = (index: number, customTech: { [key: number]: string }, setCustomTech: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>) => {
        const tech = customTech[index]?.trim();
        if (tech && !data.projects.projects[index].techStack.includes(tech)) {
            updateProject(index, "techStack", [...data.projects.projects[index].techStack, tech]);
            setCustomTech({ ...customTech, [index]: "" });
        }
    };

    const removeTechStack = (index: number, tech: string) => {
        const project = data.projects.projects[index];
        updateProject(index, "techStack", project.techStack.filter(t => t !== tech));
    };

    const togglePlatform = (index: number, platform: string) => {
        const project = data.projects.projects[index];
        const platforms = project.platform.split(", ").filter(p => p);

        if (platforms.includes(platform)) {
            const newPlatforms = platforms.filter(p => p !== platform);
            updateProject(index, "platform", newPlatforms.join(", ") || "Web");
        } else {
            updateProject(index, "platform", [...platforms, platform].join(", "));
        }
    };

    const isPlatformSelected = (index: number, platform: string) => {
        const project = data.projects.projects[index];
        return project.platform.split(", ").includes(platform);
    };

    return {
        addProject,
        removeProject,
        updateProject,
        handleImageUpload,
        removeImage,
        handleDragEnd,
        toggleTechStack,
        addCustomTech,
        removeTechStack,
        togglePlatform,
        isPlatformSelected
    };
}
