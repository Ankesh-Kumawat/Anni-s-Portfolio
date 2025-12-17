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
            images: string[];
            github?: string;
            liveDemo?: string;
        }>;
    };
    gallery: {
        folders: Array<{
            id: string;
            name: string;
            coverImage: string;
            children: Array<{
                id: string;
                name: string;
                type: "folder" | "image";
                coverImage?: string;
                imageUrl?: string;
                images?: string[];
            }>;
        }>;
        directImages: Array<{
            id: string;
            name: string;
            imageUrl: string;
        }>;
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
}

export interface StepProps {
    data: EditorData;
    setData: React.Dispatch<React.SetStateAction<EditorData>>;
    onDownload?: () => Promise<void>;
}
