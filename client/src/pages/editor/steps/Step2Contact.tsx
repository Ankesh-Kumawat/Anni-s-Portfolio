import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StepProps } from "../types";

export default function Step2Contact({ data, setData }: StepProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                <p className="text-gray-600">How can people reach you?</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.contact.email}
                    onChange={(e) =>
                        setData((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, email: e.target.value },
                        }))
                    }
                    placeholder="your.email@example.com"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact-location">Location *</Label>
                <Input
                    id="contact-location"
                    value={data.contact.location}
                    onChange={(e) =>
                        setData((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, location: e.target.value },
                        }))
                    }
                    placeholder="San Francisco, CA"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Welcome Message</Label>
                <Textarea
                    id="message"
                    value={data.contact.message}
                    onChange={(e) =>
                        setData((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, message: e.target.value },
                        }))
                    }
                    placeholder="Let's work together on your next project..."
                    rows={4}
                    className="resize-none"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input
                    id="copyright"
                    value={data.contact.copyright}
                    onChange={(e) =>
                        setData((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, copyright: e.target.value },
                        }))
                    }
                    placeholder="© 2024 Your Name. All rights reserved."
                />
            </div>
        </div>
    );
}
