import { Mail, MapPin, MessageSquare, Copyright, Sparkles } from "lucide-react";
import type { EditorData } from "../../types";

interface LivePreviewProps {
    data: EditorData;
}

export default function LivePreview({ data }: LivePreviewProps) {
    return (
        <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <h4 className="font-bold text-foreground">Live Preview</h4>
            </div>
            <div className="space-y-4">
                <div className="bg-muted rounded-xl p-4 border border">
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</span>
                            <p className="text-sm text-foreground mt-1 font-medium break-all">
                                {data.contact.email || <span className="text-muted-foreground/60 italic">Not set</span>}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-muted rounded-xl p-4 border border">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</span>
                            <p className="text-sm text-foreground mt-1 font-medium">
                                {data.contact.location || <span className="text-muted-foreground/60 italic">Not set</span>}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-muted rounded-xl p-4 border border">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</span>
                            <p className="text-sm text-foreground mt-1">
                                {data.contact.message || <span className="text-muted-foreground/60 italic">Not set</span>}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-muted rounded-xl p-4 border border">
                    <div className="flex items-start gap-3">
                        <Copyright className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Copyright</span>
                            <p className="text-sm text-foreground mt-1">
                                {data.contact.copyright || <span className="text-muted-foreground/60 italic">Not set</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
