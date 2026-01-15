import { Sparkles, Link2 } from "lucide-react";
import type { StepProps } from "../../types";
import PlatformSelector from "./PlatformSelector";
import LinksList from "./LinksList";
import SocialStats from "./SocialStats";
import SocialPreview from "./SocialPreview";
import { POPULAR_PLATFORMS } from "./platforms";
import { calculateStep3Completion } from "../../lib/completionCalculator";

export default function Step3Social({ data, setData }: StepProps) {
    const togglePlatform = (platformValue: string) => {
        const existingIndex = data.social.links.findIndex(link => link.platform === platformValue);

        if (existingIndex >= 0) {
            // Remove if exists
            setData((prev) => ({
                ...prev,
                social: {
                    links: prev.social.links.filter((_, i) => i !== existingIndex),
                },
            }));
        } else {
            // Add new
            const platform = POPULAR_PLATFORMS.find((p: any) => p.value === platformValue);
            const newLink: any = {
                name: platform?.label || "",
                url: "",
                platform: platformValue
            };
            
            // Initialize WhatsApp fields if platform is WhatsApp
            if (platformValue === "whatsapp") {
                newLink.whatsapp = {
                    contactNumber: "",
                    groupLink: "",
                    channelLink: ""
                };
            }
            
            setData((prev) => ({
                ...prev,
                social: {
                    links: [
                        ...prev.social.links,
                        newLink,
                    ],
                },
            }));
        }
    };

    const updateLink = (index: number, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            social: {
                links: prev.social.links.map((link, i) => {
                    if (i !== index) return link;
                    
                    // Handle nested whatsapp fields
                    if (field.startsWith("whatsapp.")) {
                        const whatsappField = field.split(".")[1];
                        return {
                            ...link,
                            whatsapp: {
                                ...link.whatsapp,
                                [whatsappField]: value
                            }
                        };
                    }
                    
                    // Handle regular fields
                    return { ...link, [field]: value };
                }),
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

    const isPlatformAdded = (platformValue: string) => {
        return data.social.links.some(link => link.platform === platformValue);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Social Links</h2>
                        <p className="text-muted-foreground text-lg">Select platforms and add your profile links</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2 border">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold text-primary">
                                {calculateStep3Completion(data)}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Info Notice */}
            <div className="mb-8 p-6 bg-card border-2 border-primary/30 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <p className="text-base font-bold text-foreground">Optional Section - Click to Add</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Click on any platform below to add it. You can add as many or as few as you like. All fields are optional.
                    </p>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[1fr_380px] gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <PlatformSelector
                        isPlatformAdded={isPlatformAdded}
                        togglePlatform={togglePlatform}
                    />
                    {data.social.links.length > 0 && (
                        <LinksList
                            links={data.social.links}
                            updateLink={updateLink}
                            removeLink={removeLink}
                        />
                    )}
                </div>

                {/* Right Column - Stats & Preview */}
                <div className="space-y-6">
                    <SocialStats links={data.social.links} />
                    {data.social.links.length > 0 && (
                        <SocialPreview links={data.social.links} />
                    )}
                    {/* Help Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border">
                        <h4 className="font-bold text-foreground mb-3">💡 Quick Tips</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Click any platform to add it</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>All fields are optional</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Add as many or few as you like</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Test links before moving on</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
