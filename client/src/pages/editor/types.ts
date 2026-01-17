export interface EditorData {
    about: {
        personal: {
            name: string;
            title: string;
            location: string;
            avatar: string;
            bio: string;
        };
        skills: string[];
        experience: Array<{
            id: string;
            title: string;
            company: string;
            period: string;
            description: string;
        }>;
    };
    contact: {
        email: string;
        location: string;
        message: string;
        copyright: string;
    };
    social: {
        links: Array<{
            name: string;
            url: string;
            platform: string;
            whatsapp?: {
                contactNumber?: string;
                groupLink?: string;
                channelLink?: string;
            };
        }>;
    };
    projects: {
        projects: Array<{
            id: string;
            name: string;
            tagline: string;
            description: string;
            status: string;
            platform: string;
            techStack: string[];
            overview: string;
            problem: string;
            solution: string;
            outcome: string;
            features: Array<{
                title: string;
                description: string;
            }>;
            architecture: {
                structure: string;
                dataHandling: string;
                scalability: string;
                performance: string;
            };
            challenges: Array<{
                challenge: string;
                solution: string;
                learning: string;
            }>;
            // @deprecated - Legacy field kept for backwards compatibility. Use coverImages instead.
            coverImage: string;
            coverImages: {
                [platform: string]: string;
            };
            images: string[];
            platformImages: {
                [platform: string]: string[];
            };
            github?: string;
            liveDemo?: string;
        }>;
    };
    gallery: {
        coverImages: {
            [projectId: string]: {
                [platform: string]: string;
            };
        };
        platformImages: {
            [projectId: string]: {
                [platform: string]: string[];
            };
        };
    };
    notepad: {
        defaultNotes: Array<{
            id: string;
            title: string;
            content: string;
            isPinned: boolean;
        }>;
    };
    terminal: {
        username: string;
        userRole: string;
        about: string;
        contact: {
            email: string;
            location: string;
        };
        skills: {
            technical: string[];
            soft: string[];
        };
    };
    database: {
        user: {
            user_id: string;
            name: string;
            nickname: string;
            email: string;
            role: string;
            department: string;
            status: string;
            joined_date: string;
            last_active: string;
        };
        projects: Array<{
            project_id: string;
            name: string;
            status: string;
            platform: string;
            tech_stack: string;
            created_date: string;
            last_updated: string;
        }>;
    };
    settings: {
        account: {
            name: string;
            role: string;
            avatar: string;
        };
    };
    assets: {
        images: Array<{
            file: File;
            path: string;
            preview: string;
        }>;
        music: Array<{
            file: File;
            name: string;
        }>;
    };
    browser: {
        bookmarks: Array<{
            id: string;
            name: string;
            url: string;
            icon?: string;
            category?: string;
        }>;
        history: Array<{
            url: string;
            title: string;
            timestamp: number;
        }>;
        quickLinks: Array<{
            name: string;
            url: string;
            icon?: string;
            color?: string;
        }>;
    };
    music: {
        songs: Array<{
            id: string;
            title: string;
            artist: string;
            audioUrl: string;
            coverUrl: string;
            duration: string;
        }>;
    };
    youtube: {
        apiKey: string;
        channelId: string;
        channelName: string;
        channelLogo: string;
    };
    preferences: {
        wallpapers: Array<{
            id: string;
            type: "image" | "video";
            url: string;
            device: "desktop" | "mobile";
            uploadedAt: string;
        }>;
        activeWallpaper: {
            desktop: string; // wallpaper id
            mobile: string; // wallpaper id
        };
        wallpaperEffects: {
            desktop: {
                blur: number;
                opacity: number;
            };
            mobile: {
                blur: number;
                opacity: number;
            };
        };
        iconPacks: Array<{
            id: string;
            name: string;
            icons: {
                [appId: string]: string; // appId -> icon URL
            };
            uploadedAt: string;
        }>;
        activeIconPack: string; // icon pack id
        apps: {
            globalNameColor: string;
            showLabels: boolean;
        };
        theme: "dark" | "light" | "soft-dark" | "forest-green" | "ocean-blue" | "sunset-orange" | "lavender-dream" | "cream-chocolate" | "rose-gold" | "mint-fresh" | "peachy-keen" | "sky-blue";
    };
}

export interface StepProps {
    data: EditorData;
    setData: React.Dispatch<React.SetStateAction<EditorData>>;
    onDownload?: () => Promise<void>;
}
