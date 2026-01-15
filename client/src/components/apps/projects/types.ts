export type ProjectStatus = "Active" | "In Development" | "Rebuilding" | "Completed";
export type ProjectPlatform = "Mobile" | "Web" | "Desktop" | "Cross-Platform";

export interface ProjectFeature {
    title: string;
    description: string;
}

export interface ProjectChallenge {
    challenge: string;
    solution: string;
    learning: string;
}

export interface Project {
    id: string;
    name: string;
    tagline: string;
    description: string;
    status: ProjectStatus;
    platform: ProjectPlatform;
    techStack: string[];

    // Detail page content
    overview: string;
    problem: string;
    solution: string;
    outcome: string;

    features: ProjectFeature[];
    architecture: {
        structure: string;
        dataHandling: string;
        scalability: string;
        performance: string;
    };
    challenges: ProjectChallenge[];

    // Media
    images: string[];
    coverImage?: string; // Legacy - single cover image
    coverImages?: { [platform: string]: string }; // Platform-based cover images
    platformImages?: { [platform: string]: string[] }; // Platform-based screenshot galleries

    // Links
    github?: string;
    liveDemo?: string;
    relatedProject?: string;
}
