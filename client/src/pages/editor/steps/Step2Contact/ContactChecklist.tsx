import { Check, Mail, MapPin, MessageSquare, Copyright } from "lucide-react";
import type { EditorData } from "../../types";

interface ContactChecklistProps {
    data: EditorData;
}

export default function ContactChecklist({ data }: ContactChecklistProps) {
    const checklistItems = [
        { label: "Email Address", value: data.contact.email, icon: Mail, required: true },
        { label: "Location", value: data.contact.location, icon: MapPin, required: true },
        { label: "Welcome Message", value: data.contact.message, icon: MessageSquare, required: false },
        { label: "Copyright Text", value: data.contact.copyright, icon: Copyright, required: false },
    ];

    return (
        <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
            <div className="flex items-center gap-2 mb-5">
                <Check className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">Contact Checklist</h4>
            </div>
            <div className="space-y-3">
                {checklistItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isComplete = !!item.value;
                    return (
                        <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                                isComplete ? "bg-primary/10 border border-primary" : "bg-muted border border"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${isComplete ? "text-primary" : "text-muted-foreground/60"}`} />
                                <span className={`text-sm font-medium ${isComplete ? "text-primary" : "text-muted-foreground"}`}>
                                    {item.label}
                                    {!item.required && <span className="text-xs text-muted-foreground/60 ml-1">(Optional)</span>}
                                </span>
                            </div>
                            {isComplete ? (
                                <Check className="w-5 h-5 text-primary" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
