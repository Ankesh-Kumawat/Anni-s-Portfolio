import type { EditorData } from "../../types";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";

export function useProjectHandlers(data: EditorData, setData: React.Dispatch<React.SetStateAction<EditorData>>) {
    const syncGallery = (updatedProjects: any[]) => {
        // Get cover image for projects folder (first project's cover)
        const projectsFolderCover = updatedProjects.length > 0 && updatedProjects[0].coverImage
            ? updatedProjects[0].coverImage
            : "";

        return {
            folders: data.gallery.folders.length > 0 ? data.gallery.folders.map(folder => {
                if (folder.id === "projects") {
                    return {
                        ...folder,
                        coverImage: projectsFolderCover,
                        children: updatedProjects.map(p => {
                            return {
                                id: p.id,
                                name: p.name || "Untitled Project",
                                type: "folder" as const,
                                coverImage: p.coverImage || "",
                                children: p.images.map((url: string, idx: number) => ({
                                    id: `${p.id}-img-${idx}`,
                                    name: `Screenshot ${idx + 1}`,
                                    type: "image" as const,
                                    imageUrl: url
                                }))
                            };
                        })
                    };
                }
                return folder;
            }) : [{
                id: "projects",
                name: "Projects",
                type: "folder" as const,
                coverImage: projectsFolderCover,
                children: updatedProjects.map(p => {
                    return {
                        id: p.id,
                        name: p.name || "Untitled Project",
                        type: "folder" as const,
                        coverImage: p.coverImage || "",
                        children: p.images.map((url: string, idx: number) => ({
                            id: `${p.id}-img-${idx}`,
                            name: `Screenshot ${idx + 1}`,
                            type: "image" as const,
                            imageUrl: url
                        }))
                    };
                })
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
                        coverImage: "",
                        coverImages: {},
                        images: [],
                        platformImages: {},
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

    // REMOVED: Legacy handleCoverImageUpload - Use handlePlatformCoverImageUpload instead

    // REMOVED: Legacy handleImageUpload - Use handlePlatformImageUpload instead

    const handlePlatformImageUpload = async (projectIndex: number, platform: string, e: React.ChangeEvent<HTMLInputElement>, onProgress?: (current: number, total: number) => void) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            // Upload images one by one to track progress
            const cloudinaryUrls: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const url = await uploadToCloudinary(files[i]);
                cloudinaryUrls.push(url);

                // Report progress
                if (onProgress) {
                    onProgress(i + 1, files.length);
                }
            }

            // Update project with platform-specific image URLs
            setData((prev) => {
                const updatedProjects = prev.projects.projects.map((proj, i) => {
                    if (i !== projectIndex) return proj;

                    // Initialize platformImages if it doesn't exist
                    if (!proj.platformImages) {
                        proj.platformImages = {};
                    }

                    const existingPlatformImages = proj.platformImages?.[platform] || [];
                    return {
                        ...proj,
                        platformImages: {
                            ...proj.platformImages,
                            [platform]: [...existingPlatformImages, ...cloudinaryUrls]
                        }
                    };
                });

                return {
                    ...prev,
                    projects: { projects: updatedProjects },
                    gallery: syncGallery(updatedProjects)
                };
            });
        } catch (error) {
            console.error("Failed to upload platform images:", error);
            alert("Failed to upload some images. Please try again.");
        }
    };

    const removePlatformImage = (projectIndex: number, platform: string, imageIndex: number) => {
        setData((prev) => {
            const updatedProjects = prev.projects.projects.map((proj, i) => {
                if (i !== projectIndex) return proj;

                const platformImages = proj.platformImages?.[platform] || [];
                return {
                    ...proj,
                    platformImages: {
                        ...proj.platformImages,
                        [platform]: platformImages.filter((_, idx) => idx !== imageIndex)
                    }
                };
            });

            return {
                ...prev,
                projects: { projects: updatedProjects },
                gallery: syncGallery(updatedProjects)
            };
        });
    };

    const handlePlatformDragEnd = (projectIndex: number, platform: string, result: any) => {
        if (!result.destination) return;

        setData((prev) => {
            const project = prev.projects.projects[projectIndex];
            const platformImages = project.platformImages?.[platform] || [];
            const items = Array.from(platformImages);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedProjects = prev.projects.projects.map((proj, i) => {
                if (i !== projectIndex) return proj;

                return {
                    ...proj,
                    platformImages: {
                        ...proj.platformImages,
                        [platform]: items
                    }
                };
            });

            return {
                ...prev,
                projects: { projects: updatedProjects },
                gallery: syncGallery(updatedProjects)
            };
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

    const handlePlatformCoverImageUpload = async (projectIndex: number, platform: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const cloudinaryUrl = await uploadToCloudinary(file);

            setData((prev) => {
                const updatedProjects = prev.projects.projects.map((proj, i) => {
                    if (i !== projectIndex) return proj;

                    // Initialize coverImages if it doesn't exist
                    if (!proj.coverImages) {
                        proj.coverImages = {};
                    }

                    return {
                        ...proj,
                        coverImages: {
                            ...proj.coverImages,
                            [platform]: cloudinaryUrl
                        }
                    };
                });

                return {
                    ...prev,
                    projects: { projects: updatedProjects },
                    gallery: syncGallery(updatedProjects)
                };
            });
        } catch (error) {
            console.error("Failed to upload cover image:", error);
            alert("Failed to upload cover image. Please try again.");
        }
    };

    const removePlatformCoverImage = (projectIndex: number, platform: string) => {
        setData((prev) => {
            const updatedProjects = prev.projects.projects.map((proj, i) => {
                if (i !== projectIndex) return proj;

                const coverImages = { ...proj.coverImages };
                delete coverImages[platform];

                return {
                    ...proj,
                    coverImages
                };
            });

            return {
                ...prev,
                projects: { projects: updatedProjects },
                gallery: syncGallery(updatedProjects)
            };
        });
    };

    return {
        addProject,
        removeProject,
        updateProject,
        // Legacy handlers removed - use platform-specific handlers
        handlePlatformImageUpload,
        handlePlatformCoverImageUpload,
        removePlatformImage,
        removePlatformCoverImage,
        handlePlatformDragEnd,
        toggleTechStack,
        addCustomTech,
        removeTechStack,
        togglePlatform,
        isPlatformSelected
    };
}
