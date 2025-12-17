export interface GalleryItem {
    id: string;
    name: string;
    type: 'folder' | 'image';
    coverImage?: string;
    imageUrl?: string;
    children?: GalleryItem[];
}

export const GALLERY_STRUCTURE: GalleryItem[] = [
    {
        id: "projects",
        name: "Projects",
        type: "folder",
        coverImage: "/assets/projects/devstudio/cover.png",
        children: [
            {
                id: "cineverse",
                name: "CineVerse",
                type: "folder",
                coverImage: "/assets/projects/cineverse/project_fallback.jpg",
                children: [
                    { id: "cineverse-1", name: "Screenshot 1", type: "image", imageUrl: "/assets/projects/cineverse/project_fallback.jpg" },
                    { id: "cineverse-2", name: "Screenshot 2", type: "image", imageUrl: "/assets/projects/cineverse/project_fallback.jpg" },
                    { id: "cineverse-3", name: "Screenshot 3", type: "image", imageUrl: "/assets/projects/cineverse/project_fallback.jpg" },
                    { id: "cineverse-4", name: "Screenshot 4", type: "image", imageUrl: "/assets/projects/cineverse/project_fallback.jpg" },
                    { id: "cineverse-5", name: "Screenshot 5", type: "image", imageUrl: "/assets/projects/cineverse/project_fallback.jpg" },
                    { id: "cineverse-6", name: "Screenshot 6", type: "image", imageUrl: "/assets/projects/cineverse/project_fallback.jpg" },
                ]
            },
            {
                id: "devstudio",
                name: "DevStudio",
                type: "folder",
                coverImage: "/assets/projects/devstudio/cover.png",
                children: [
                    { id: "devstudio-cover", name: "Cover", type: "image", imageUrl: "/assets/projects/devstudio/cover.png" },
                    { id: "devstudio-1", name: "Screenshot 1", type: "image", imageUrl: "/assets/projects/devstudio/1.png" },
                    { id: "devstudio-2", name: "Screenshot 2", type: "image", imageUrl: "/assets/projects/devstudio/2.png" },
                    { id: "devstudio-3", name: "Screenshot 3", type: "image", imageUrl: "/assets/projects/devstudio/3.png" },
                    { id: "devstudio-4", name: "Screenshot 4", type: "image", imageUrl: "/assets/projects/devstudio/4.png" },
                    { id: "devstudio-5", name: "Screenshot 5", type: "image", imageUrl: "/assets/projects/devstudio/5.png" },
                    { id: "devstudio-6", name: "Screenshot 6", type: "image", imageUrl: "/assets/projects/devstudio/6.png" },
                    { id: "devstudio-7", name: "Screenshot 7", type: "image", imageUrl: "/assets/projects/devstudio/7.png" },
                    { id: "devstudio-8", name: "Screenshot 8", type: "image", imageUrl: "/assets/projects/devstudio/8.png" },
                ]
            },
            {
                id: "portfolio-os",
                name: "Portfolio OS",
                type: "folder",
                coverImage: "/assets/projects/portfolio-os/project_fallback.jpg",
                children: [
                    { id: "portfolio-1", name: "Screenshot 1", type: "image", imageUrl: "/assets/projects/portfolio-os/project_fallback.jpg" },
                    { id: "portfolio-2", name: "Screenshot 2", type: "image", imageUrl: "/assets/projects/portfolio-os/project_fallback.jpg" },
                    { id: "portfolio-3", name: "Screenshot 3", type: "image", imageUrl: "/assets/projects/portfolio-os/project_fallback.jpg" },
                    { id: "portfolio-4", name: "Screenshot 4", type: "image", imageUrl: "/assets/projects/portfolio-os/project_fallback.jpg" },
                    { id: "portfolio-5", name: "Screenshot 5", type: "image", imageUrl: "/assets/projects/portfolio-os/project_fallback.jpg" },
                    { id: "portfolio-6", name: "Screenshot 6", type: "image", imageUrl: "/assets/projects/portfolio-os/project_fallback.jpg" },
                ]
            },
            {
                id: "mentorhub",
                name: "MentorHub",
                type: "folder",
                coverImage: "/assets/projects/mentorhub/project_fallback.jpg",
                children: [
                    { id: "mentorhub-1", name: "Screenshot 1", type: "image", imageUrl: "/assets/projects/mentorhub/project_fallback.jpg" },
                    { id: "mentorhub-2", name: "Screenshot 2", type: "image", imageUrl: "/assets/projects/mentorhub/project_fallback.jpg" },
                    { id: "mentorhub-3", name: "Screenshot 3", type: "image", imageUrl: "/assets/projects/mentorhub/project_fallback.jpg" },
                    { id: "mentorhub-4", name: "Screenshot 4", type: "image", imageUrl: "/assets/projects/mentorhub/project_fallback.jpg" },
                    { id: "mentorhub-5", name: "Screenshot 5", type: "image", imageUrl: "/assets/projects/mentorhub/project_fallback.jpg" },
                    { id: "mentorhub-6", name: "Screenshot 6", type: "image", imageUrl: "/assets/projects/mentorhub/project_fallback.jpg" },
                ]
            },
        ]
    },
    {
        id: "me",
        name: "Me",
        type: "folder",
        coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
        children: [
            { id: "me-1", name: "Photo 1", type: "image", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800" },
            { id: "me-2", name: "Photo 2", type: "image", imageUrl: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=800" },
            { id: "me-3", name: "Photo 3", type: "image", imageUrl: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?auto=format&fit=crop&q=80&w=800" },
        ]
    },
    // Direct images in root
    { id: "wallpaper-1", name: "Wallpaper 1", type: "image", imageUrl: "https://images.unsplash.com/photo-1518098268026-4e1891306642?auto=format&fit=crop&q=80&w=800" },
    { id: "wallpaper-2", name: "Wallpaper 2", type: "image", imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=800" },
];
