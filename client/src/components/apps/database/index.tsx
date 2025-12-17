import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Database as DatabaseIcon, Search, ChevronRight, ChevronDown, FileJson } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JSX } from "react/jsx-runtime";

interface DataNode {
    name: string;
    type: "file" | "object" | "array" | "value";
    value?: any;
    children?: DataNode[];
    expanded?: boolean;
}

export default function Database() {
    const [data, setData] = useState<Record<string, any>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]));

    // Load all JSON files
    useEffect(() => {
        const loadData = async () => {
            try {
                const [about, projects, contact] = await Promise.all([
                    fetch(`/data/about.json?t=${Date.now()}`).then(r => r.json()).catch(() => null),
                    fetch(`/data/projects.json?t=${Date.now()}`).then(r => r.json()).catch(() => null),
                    fetch(`/data/contact.json?t=${Date.now()}`).then(r => r.json()).catch(() => null),
                ]);

                setData({
                    about: about || {},
                    projects: projects || {},
                    contact: contact || {},
                });
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        loadData();
    }, []);

    const toggleNode = (path: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    };

    const buildTree = (obj: any, path: string = "root"): DataNode[] => {
        if (obj === null || obj === undefined) {
            return [{ name: "null", type: "value", value: null }];
        }

        if (Array.isArray(obj)) {
            return obj.map((item, index) => ({
                name: `[${index}]`,
                type: typeof item === "object" ? "object" : "value",
                value: typeof item === "object" ? undefined : item,
                children: typeof item === "object" ? buildTree(item, `${path}.${index}`) : undefined,
            }));
        }

        if (typeof obj === "object") {
            return Object.entries(obj).map(([key, value]) => ({
                name: key,
                type: Array.isArray(value) ? "array" : typeof value === "object" && value !== null ? "object" : "value",
                value: typeof value === "object" ? undefined : value,
                children: typeof value === "object" && value !== null ? buildTree(value, `${path}.${key}`) : undefined,
            }));
        }

        return [{ name: String(obj), type: "value", value: obj }];
    };

    const renderValue = (value: any) => {
        if (value === null) return <span className="text-gray-400">null</span>;
        if (value === undefined) return <span className="text-gray-400">undefined</span>;
        if (typeof value === "string") return <span className="text-green-600">"{value}"</span>;
        if (typeof value === "number") return <span className="text-blue-600">{value}</span>;
        if (typeof value === "boolean") return <span className="text-purple-600">{String(value)}</span>;
        return <span className="text-gray-600">{String(value)}</span>;
    };

    const renderNode = (node: DataNode, path: string, level: number = 0): JSX.Element => {
        const isExpanded = expandedNodes.has(path);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={path}>
                <div
                    className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded cursor-pointer group"
                    style={{ paddingLeft: `${level * 20 + 8}px` }}
                    onClick={() => hasChildren && toggleNode(path)}
                >
                    {hasChildren ? (
                        isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )
                    ) : (
                        <span className="w-4" />
                    )}

                    <span className="font-mono text-sm font-semibold text-blue-600">{node.name}</span>

                    {node.type === "array" && (
                        <Badge variant="outline" className="text-xs">
                            Array[{node.children?.length || 0}]
                        </Badge>
                    )}

                    {node.type === "value" && (
                        <>
                            <span className="text-muted-foreground">:</span>
                            <span className="font-mono text-sm">{renderValue(node.value)}</span>
                        </>
                    )}
                </div>

                {hasChildren && isExpanded && (
                    <div>
                        {node.children!.map((child, index) =>
                            renderNode(child, `${path}.${child.name}`, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    const dataTree = buildTree(data);
    const filteredTree = searchQuery
        ? dataTree.filter(node =>
            node.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : dataTree;

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="border-b bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-3 mb-2">
                    <DatabaseIcon className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Database Viewer</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Live view of all portfolio data in JSON tree structure
                </p>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search data..."
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Data Tree */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <div className="border rounded-lg bg-card overflow-hidden">
                    <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-primary" />
                        <span className="font-mono text-sm font-semibold">Portfolio Data</span>
                        <Badge variant="outline" className="ml-auto">
                            {Object.keys(data).length} files
                        </Badge>
                    </div>

                    <div className="p-4 font-mono text-sm">
                        {filteredTree.length > 0 ? (
                            filteredTree.map((node, index) =>
                                renderNode(node, `root.${node.name}`, 0)
                            )
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <DatabaseIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No data found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                        💡 <strong>Note:</strong> This viewer shows live data from all JSON files (about.json, projects.json, contact.json).
                        Click on nodes to expand/collapse and explore the data structure.
                    </p>
                </div>
            </div>
        </div>
    );
}
