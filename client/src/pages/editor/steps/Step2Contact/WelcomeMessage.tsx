import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Info } from "lucide-react";

interface WelcomeMessageProps {
    message: string;
    onMessageChange: (value: string) => void;
}

export default function WelcomeMessage({ message, onMessageChange }: WelcomeMessageProps) {
    return (
        <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Welcome Message</h3>
                    <p className="text-sm text-muted-foreground">
                        Optional - Greet your visitors
                        <span className="text-xs text-muted-foreground/60 ml-1">(Optional)</span>
                    </p>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                    <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    placeholder="Let's work together on your next project..."
                    rows={5}
                    className="resize-none text-base"
                />
                <div className="flex justify-between items-center">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">A friendly message for visitors on your contact page</p>
                    </div>
                    <p className="text-xs text-muted-foreground/60">{message.length} characters</p>
                </div>
            </div>
        </div>
    );
}
