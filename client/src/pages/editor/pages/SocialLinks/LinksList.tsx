import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Link2, Check, ExternalLink } from "lucide-react";
import { getPlatformInfo } from "./platforms";

interface LinksListProps {
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
    updateLink: (index: number, field: string, value: string) => void;
    removeLink: (index: number) => void;
}

export default function LinksList({ links, updateLink, removeLink }: LinksListProps) {
    return (
        <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Your Links</h3>
                    <p className="text-sm text-muted-foreground">{links.length} platform{links.length !== 1 ? 's' : ''} selected</p>
                </div>
            </div>

            <div className="space-y-5">
                {links.map((link, index) => {
                    const platformInfo = getPlatformInfo(link.platform);
                    const PlatformIcon = platformInfo.icon;
                    const isComplete = !!link.url;

                    return (
                        <div key={index} className="p-5 bg-muted rounded-xl border-2 border">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${platformInfo.color} flex items-center justify-center`}>
                                        <PlatformIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{platformInfo.label}</h4>
                                        {isComplete && (
                                            <Badge className="bg-primary/10 text-primary border-primary mt-1">
                                                <Check className="w-3 h-3 mr-1" />
                                                Complete
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={() => removeLink(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">Display Name (Optional)</Label>
                                    <Input
                                        value={link.name}
                                        onChange={(e) => updateLink(index, "name", e.target.value)}
                                        placeholder={platformInfo.label}
                                        className="h-11 text-base bg-card"
                                    />
                                </div>

                                {link.platform === "whatsapp" ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-foreground">Contact Number (Optional)</Label>
                                            <Input
                                                value={link.whatsapp?.contactNumber || ""}
                                                onChange={(e) => updateLink(index, "whatsapp.contactNumber", e.target.value)}
                                                placeholder="+91 9876543210"
                                                className="h-11 text-base bg-card"
                                            />
                                            <p className="text-xs text-muted-foreground">Direct chat link with your number</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-foreground">Group Link (Optional)</Label>
                                            <Input
                                                value={link.whatsapp?.groupLink || ""}
                                                onChange={(e) => updateLink(index, "whatsapp.groupLink", e.target.value)}
                                                placeholder="https://chat.whatsapp.com/..."
                                                className="h-11 text-base bg-card"
                                            />
                                            <p className="text-xs text-muted-foreground">WhatsApp group invite link</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-foreground">Channel Link (Optional)</Label>
                                            <Input
                                                value={link.whatsapp?.channelLink || ""}
                                                onChange={(e) => updateLink(index, "whatsapp.channelLink", e.target.value)}
                                                placeholder="https://whatsapp.com/channel/..."
                                                className="h-11 text-base bg-card"
                                            />
                                            <p className="text-xs text-muted-foreground">WhatsApp channel link</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-foreground">Profile URL (Optional)</Label>
                                        <Input
                                            value={link.url}
                                            onChange={(e) => updateLink(index, "url", e.target.value)}
                                            placeholder={platformInfo.placeholder}
                                            className="h-11 text-base bg-card"
                                        />
                                    </div>
                                )}

                                {link.url && (
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-primary font-medium"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Test Link
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
