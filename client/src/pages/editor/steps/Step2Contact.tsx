import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StepProps } from "../types";

export default function Step2Contact({ data, setData }: StepProps) {
    const isLocationAutoFilled = data.contact.location === data.about.personal.location;

    return (
        <div className="space-y-6 sm:space-y-8">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                <p className="text-sm sm:text-base text-gray-600">How can people reach you?</p>
            </div>

            {/* Auto-fill Notice */}
            {(isLocationAutoFilled || data.contact.copyright) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-blue-900">
                        ✨ Some fields are auto-filled from your personal info. You can edit them if needed.
                    </p>
                </div>
            )}

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
                <Label htmlFor="contact-location">
                    Location * {isLocationAutoFilled && <span className="text-xs text-blue-600">(auto-filled)</span>}
                </Label>
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
                <Label htmlFor="copyright">
                    Copyright Text {data.contact.copyright && <span className="text-xs text-blue-600">(auto-generated)</span>}
                </Label>
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
