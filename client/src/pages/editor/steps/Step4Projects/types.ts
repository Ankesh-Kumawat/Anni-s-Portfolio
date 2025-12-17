import type { EditorData } from "../../types";

export interface ProjectHandlers {
    updateProject: (index: number, field: string, value: any) => void;
    removeProject: (index: number) => void;
    handleImageUpload: (projectIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: (projectIndex: number, imageIndex: number) => void;
    handleDragEnd: (projectIndex: number, result: any) => void;
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
}
