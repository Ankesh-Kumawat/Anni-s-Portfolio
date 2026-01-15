import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Trash2, Loader2, Check, X } from "lucide-react";
import { getTechStacks, saveTechStacks } from "@/lib/firebase-service";
import { useToast } from "@/hooks/use-toast";

export function TechStackManager() {
    const [techStacks, setTechStacks] = useState<{ [key: string]: string[] }>({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [newCategory, setNewCategory] = useState("");
    const [techInput, setTechInput] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        loadTechStacks();
    }, []);

    const loadTechStacks = async () => {
        try {
            setLoading(true);
            const stacks = await getTechStacks();
            setTechStacks(stacks);
            if (Object.keys(stacks).length > 0) {
                setSelectedCategory(Object.keys(stacks)[0]);
            }
        } catch (error) {
            console.error("Error loading tech stacks:", error);
            toast({
                title: "Error",
                description: "Failed to load tech stacks",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        const category = newCategory.trim() || selectedCategory;
        
        if (!category) {
            toast({
                title: "Error",
                description: "Please select or enter a category",
                variant: "destructive"
            });
            return;
        }

        if (!techInput.trim()) {
            toast({
                title: "Error",
                description: "Please enter tech stacks",
                variant: "destructive"
            });
            return;
        }

        try {
            setUploading(true);
            
            // Parse comma-separated tech stacks
            const techs = techInput
                .split(",")
                .map(t => t.trim())
                .filter(t => t.length > 0);

            if (techs.length === 0) {
                toast({
                    title: "Error",
                    description: "No valid tech stacks found",
                    variant: "destructive"
                });
                return;
            }

            // Update tech stacks (overwrite if exists)
            const updatedStacks = {
                ...techStacks,
                [category]: techs
            };

            await saveTechStacks(updatedStacks);
            setTechStacks(updatedStacks);
            setSelectedCategory(category);
            setNewCategory("");
            setTechInput("");

            toast({
                title: "Success!",
                description: `Uploaded ${techs.length} tech stacks to "${category}"`,
            });
        } catch (error) {
            console.error("Error uploading tech stacks:", error);
            toast({
                title: "Error",
                description: "Failed to upload tech stacks",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCategory = async (category: string) => {
        if (!confirm(`Delete "${category}" category and all its tech stacks?`)) {
            return;
        }

        try {
            const updatedStacks = { ...techStacks };
            delete updatedStacks[category];
            
            await saveTechStacks(updatedStacks);
            setTechStacks(updatedStacks);
            
            if (selectedCategory === category) {
                setSelectedCategory(Object.keys(updatedStacks)[0] || "");
            }

            toast({
                title: "Deleted",
                description: `Category "${category}" deleted`,
            });
        } catch (error) {
            console.error("Error deleting category:", error);
            toast({
                title: "Error",
                description: "Failed to delete category",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
                <h2 className="text-2xl font-bold text-foreground mb-2">Tech Stack Manager</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Upload tech stacks to Firebase. Comma-separated for bulk upload.
                </p>

                {/* Upload Section */}
                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Select Existing Category */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Select Existing Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(techStacks).map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat} ({techStacks[cat].length} items)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Or Add New Category */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Or Add New Category</Label>
                            <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="e.g., AI/ML, Cloud, etc."
                                className="h-10"
                            />
                        </div>
                    </div>

                    {/* Tech Stacks Input */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">
                            Tech Stacks (Comma Separated)
                        </Label>
                        <Textarea
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            placeholder="React, Vue, Angular, Next.js, TypeScript, JavaScript"
                            className="min-h-[120px] font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Separate each tech with a comma. Will overwrite existing category if selected.
                        </p>
                    </div>

                    {/* Upload Button */}
                    <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full"
                        size="lg"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading to Firebase...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload to Firebase
                            </>
                        )}
                    </Button>
                </div>

                {/* Current Tech Stacks */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Current Tech Stacks</h3>
                    
                    {Object.keys(techStacks).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No tech stacks uploaded yet</p>
                            <p className="text-sm mt-2">Upload your first category above</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(techStacks).map(([category, techs]) => (
                                <div key={category} className="bg-muted rounded-xl p-4 border-2 border">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-foreground">{category}</h4>
                                            <Badge className="bg-primary/10 text-primary border-primary">
                                                {techs.length} items
                                            </Badge>
                                        </div>
                                        <Button
                                            onClick={() => handleDeleteCategory(category)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {techs.map((tech, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
