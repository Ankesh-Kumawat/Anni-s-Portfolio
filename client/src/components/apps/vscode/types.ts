export interface FileNode {
    name: string;
    type: "file" | "folder";
    icon?: string;
    content?: string;
    children?: FileNode[];
}
