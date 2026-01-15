import { Link2 } from "lucide-react";
import { getPlatformInfo } from "./platforms";

interface SocialPreviewProps {
    links: Array<{
        name: string;
        url: string;
        platform: string;
    }>;
}

export default function SocialPreview({ links }: SocialPreviewProps) {
    return (
        <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <h4 className="font-bold text-foreground">Live Preview</h4>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                {links.map((link, index) => {
                    const platformInfo = getPlatformInfo(link.platform);
                    const PlatformIcon = platformInfo.icon;
                    return (
                        <div key={index} className="bg-card rounded-xl p-4 border border">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${platformInfo.color} flex items-center justify-center flex-shrink-0`}>
                                    <PlatformIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {link.name || platformInfo.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {link.url || <span className="text-muted-foreground/60 italic">No URL added</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
