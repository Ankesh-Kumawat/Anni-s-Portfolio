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
        setData((prev) => {
            const project = prev.projects.projects[index];

            // If updating project name and project has images, rename folder
            if (field === 'name' && project.images.length > 0) {
                const oldFolderName = project.name
                    ? project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || project.id
                    : project.id;

                const newFolderName = value
                    ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || project.id
                    : project.id;

                // Update image paths
                const updatedImages = project.images.map(imagePath => {
                    return imagePath.replace(`/assets/projects/${oldFolderName}/`, `/assets/projects/${newFolderName}/`);
                });

                // Update asset paths
                const updatedAssets = prev.assets.images.map(asset => {
                    if (asset.path.includes(`projects/${oldFolderName}/`)) {
                        return {
                            ...asset,
                            path: asset.path.replace(`projects/${oldFolderName}/`, `projects/${newFolderName}/`)
                        };
                    }
                    return asset;
                });

                const updatedProjects = prev.projects.projects.map((proj, i) =>
                    i === index ? { ...proj, [field]: value, images: updatedImages } : proj
                );

                return {
                    ...prev,
                    projects: { projects: updatedProjects },
                    assets: {
                        ...prev.assets,
                        images: updatedAssets
                    },
                    gallery: syncGallery(updatedProjects)
                };
            }

            // Normal update for other fields
            return {
                ...prev,
                projects: {
                    projects: prev.projects.projects.map((proj, i) =>
                        i === index ? { ...proj, [field]: value } : proj
                    )
                }
            };
        });
    };

    const handleImageUpload = (projectIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const project = data.projects.projects[projectIndex];

        // Create folder name from project name (sanitized)
        // If no name, use "untitled-project-{index}"
        const folderName = project.name
            ? project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            : `untitled-project-${projectIndex + 1}`;

        const filesToProcess = files;
        let processedCount = 0;
        const newImages: string[] = [];
        const newAssets: any[] = [];

        filesToProcess.forEach((file, fileIndex) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const preview = reader.result as string;
                const currentImageCount = project.images.length;
                const imageNumber = currentImageCount + fileIndex + 1;
                const extension = file.name.split('.').pop() || 'png';

                // Numbered filename
                const numberedFilename = `${imageNumber}.${extension}`;
                const assetPath = `/assets/projects/${folderName}/${numberedFilename}`;

                newImages.push(assetPath);
                newAssets.push({
                    file,
                    path: `projects/${folderName}/${numberedFilename}`,
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

                        // Add cover image (copy of first image) if this is the first upload
                        const finalAssets = [...prev.assets.images, ...newAssets];
                        if (project.images.length === 0 && newAssets.length > 0) {
                            // Find the first numbered image (1.png/jpg/etc)
                            const firstImage = newAssets.find(a => a.path.includes(`projects/${folderName}/1.`));
                            if (firstImage) {
                                const extension = firstImage.path.split('.').pop();
                                // Check if cover already exists
                                const coverExists = finalAssets.some(a => a.path.includes(`projects/${folderName}/cover.`));
                                if (!coverExists) {
                                    finalAssets.push({
                                        file: firstImage.file,
                                        path: `projects/${folderName}/cover.${extension}`,
                                        preview: firstImage.preview
                                    });
                                }
                            }
                        }

                        return {
                            ...prev,
                            projects: { projects: updatedProjects },
                            assets: {
                                ...prev.assets,
                                images: finalAssets
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

            // Rename images with new numbering
            const folderName = project.name
                ? project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || project.id
                : project.id;

            const renamedImages = items.map((imagePath, idx) => {
                const extension = imagePath.split('.').pop() || 'png';
                return `/assets/projects/${folderName}/${idx + 1}.${extension}`;
            });

            // Update assets with new paths
            const updatedAssets = prev.assets.images.map(asset => {
                const oldIndex = items.findIndex(img => img.includes(asset.path.split('/').pop() || ''));
                if (oldIndex !== -1) {
                    const newIndex = items.indexOf(items[oldIndex]);
                    const extension = asset.path.split('.').pop() || 'png';
                    return {
                        ...asset,
                        path: `projects/${folderName}/${newIndex + 1}.${extension}`
                    };
                }
                return asset;
            });

            // Update cover image to match new first image (1.png)
            const firstImageAsset = updatedAssets.find(a =>
                a.path === `projects/${folderName}/1.png` ||
                a.path === `projects/${folderName}/1.jpg` ||
                a.path === `projects/${folderName}/1.jpeg`
            );

            if (firstImageAsset) {
                const extension = firstImageAsset.path.split('.').pop() || 'png';
                // Remove old cover if exists
                const filteredAssets = updatedAssets.filter(a => !a.path.includes(`projects/${folderName}/cover.`));
                // Add new cover
                filteredAssets.push({
                    ...firstImageAsset,
                    path: `projects/${folderName}/cover.${extension}`
                });
                updatedAssets.length = 0;
                updatedAssets.push(...filteredAssets);
            }

            const updatedProjects = prev.projects.projects.map((proj, i) =>
                i === projectIndex ? { ...proj, images: renamedImages } : proj
            );

            return {
                ...prev,
                projects: { projects: updatedProjects },
                assets: {
                    ...prev.assets,
                    images: updatedAssets
                },
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
