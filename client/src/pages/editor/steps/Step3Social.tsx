import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { StepProps } from "../types";

const PLATFORMS = [
    "github",
    "linkedin",
    "twitter",
    "instagram",
    "facebook",
    "youtube",
    "dribbble",
    "behance",
    "medium",
    "dev.to",
    "other",
];

export default function Step3Social({ data, setData }: StepProps) {
    const addLink = () => {
        setData((prev) => ({
            ...prev,
            social: {
                links: [
                    ...prev.social.links,
                    { name: "", url: "", platform: "github" },
                ],
            },
        }));
    };

    const updateLink = (index: number, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            social: {
                links: prev.social.links.map((link, i) =>
                    i === index ? { ...link, [field]: value } : link
                ),
            },
        }));
    };

    const removeLink = (index: number) => {
        setData((prev) => ({
            ...prev,
            social: {
                links: prev.social.links.filter((_, i) => i !== index),
            },
        }));
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Links</h2>
                <p className="text-gray-600">Add your social media profiles</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Links</Label>
                    <Button onClick={addLink} type="button" variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Link
                    </Button>
                </div>

                {data.social.links.map((link, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold">Link {index + 1}</h4>
                            <Button
                                onClick={() => removeLink(index)}
                                variant="ghost"
                                size="sm"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Platform</Label>
                                <Select
                                    value={link.platform}
                                    onValueChange={(value) => updateLink(index, "platform", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PLATFORMS.map((platform) => (
                                            <SelectItem key={platform} value={platform}>
                                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Display Name</Label>
                                <Input
                                    value={link.name}
                                    onChange={(e) => updateLink(index, "name", e.target.value)}
                                    placeholder="GitHub Profile"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                                value={link.url}
                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                placeholder="https://github.com/username"
                            />
                        </div>
                    </div>
                ))}

                {data.social.links.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No social links added yet. Click "Add Link" to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
