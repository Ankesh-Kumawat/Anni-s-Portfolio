import type { EditorData } from "../../types";

export interface ProjectHandlers {
    updateProject: (index: number, field: string, value: any) => void;
    removeProject: (index: number) => void;
    // Legacy handlers removed - use handlePlatformCoverImageUpload and handlePlatformImageUpload
    handlePlatformImageUpload: (projectIndex: number, platform: string, e: React.ChangeEvent<HTMLInputElement>, onProgress?: (current: number, total: number) => void) => void;
    removePlatformImage: (projectIndex: number, platform: string, imageIndex: number) => void;
    handlePlatformDragEnd: (projectIndex: number, platform: string, result: any) => void;
    toggleTechStack: (index: number, tech: string) => void;
    addCustomTech: (index: number) => void;
    removeTechStack: (index: number, tech: string) => void;
    togglePlatform: (index: number, platform: string) => void;
    isPlatformSelected: (index: number, platform: string) => boolean;
}

export interface ProjectFormProps {
    project: any;
    index: number;
    data: EditorData;
    handlers: ProjectHandlers;
    customTech: { [key: number]: string };
    setCustomTech: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
    selectedCategory: { [key: number]: string };
    setSelectedCategory: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
    techStacks: { [key: string]: string[] };
    techStacksLoading: boolean;
}
