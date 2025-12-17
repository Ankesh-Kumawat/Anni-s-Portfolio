import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Link2, FolderKanban, FileText, Terminal, Database, Settings, Download, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import type { StepProps } from "../types";

export default function Step7Review({ data, onDownload }: StepProps) {
    const totalCompletion = () => {
        let completed = 0;
        let total = 7;

        // Step 1: Personal Info (required)
        if (data.about.personal.name && data.about.personal.avatar && data.about.personal.bio) completed++;
        // Step 2: Contact (required)
        if (data.contact.email && data.contact.location) completed++;
        // Step 3: Social (optional but count if added)
        if (data.social.links.length > 0) completed++;
        // Step 4: Projects (optional but count if added)
        if (data.projects.projects.length > 0) completed++;
        // Step 5: Notepad (optional but count if added)
        if (data.notepad.defaultNotes.length > 0) completed++;
        // Step 6: Advanced (auto-generated, always complete)
        completed++;
        // Step 7: Review (current step, always complete)
        completed++;

        return Math.round((completed / total) * 100);
    };

    const isComplete = totalCompletion() === 100;

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Review & Download</h2>
                        <p className="text-muted-foreground text-lg">Review your portfolio data and download the complete package</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2 border">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Overall</div>
                            <div className="text-2xl font-bold text-primary">
                                {totalCompletion()}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Status Notice */}
            {isComplete ? (
                <div className="mb-8 p-6 bg-card border-2 border-primary rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-foreground">Portfolio Complete! 🎉</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            All required sections are filled. Click "Download ZIP" in the header to get your portfolio data package.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mb-8 p-6 bg-card border-2 border rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-foreground">Almost There!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Some optional sections are incomplete. You can still download, or go back to add more content.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[1fr_380px] gap-8">
                {/* Left Column - Review Cards */}
                <div className="space-y-6">
                    {/* Step 1: Personal Info */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Personal Info</h3>
                                        <p className="text-xs text-muted-foreground">Step 1</p>
                                    </div>
                                </div>
                                {data.about.personal.name && data.about.personal.avatar && data.about.personal.bio ? (
                                    <Badge className="bg-primary text-primary-foreground border-primary">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Complete
                                    </Badge>
                                ) : (
                                    <Badge className="bg-muted text-foreground border">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Required
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Name</span>
                                <span className="text-sm font-semibold text-foreground">{data.about.personal.name || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Title</span>
                                <span className="text-sm font-semibold text-foreground">{data.about.personal.title || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Location</span>
                                <span className="text-sm font-semibold text-foreground">{data.about.personal.location || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Skills</span>
                                <span className="text-sm font-semibold text-foreground">{data.about.skills.length} added</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Experience</span>
                                <span className="text-sm font-semibold text-foreground">{data.about.experience.length} entries</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Avatar</span>
                                <span className="text-sm font-semibold text-foreground">{data.about.personal.avatar ? "✓ Uploaded" : "Not set"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Contact */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Contact</h3>
                                        <p className="text-xs text-muted-foreground">Step 2</p>
                                    </div>
                                </div>
                                {data.contact.email && data.contact.location ? (
                                    <Badge className="bg-primary text-primary-foreground border-primary">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Complete
                                    </Badge>
                                ) : (
                                    <Badge className="bg-muted text-foreground border">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Required
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <span className="text-sm font-semibold text-foreground">{data.contact.email || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Location</span>
                                <span className="text-sm font-semibold text-foreground">{data.contact.location || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Message</span>
                                <span className="text-sm font-semibold text-foreground">{data.contact.message ? "✓ Added" : "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Copyright</span>
                                <span className="text-sm font-semibold text-foreground">{data.contact.copyright ? "✓ Added" : "Not set"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Social Links */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Link2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Social Links</h3>
                                        <p className="text-xs text-muted-foreground">Step 3 - Optional</p>
                                    </div>
                                </div>
                                {data.social.links.length > 0 ? (
                                    <Badge className="bg-primary text-primary-foreground border-primary">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {data.social.links.length} Added
                                    </Badge>
                                ) : (
                                    <Badge className="bg-muted text-foreground border">
                                        Optional
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Links</span>
                                <span className="text-sm font-semibold text-foreground">{data.social.links.length} platforms</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Projects & Gallery */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FolderKanban className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Projects & Gallery</h3>
                                        <p className="text-xs text-muted-foreground">Step 4 - Optional</p>
                                    </div>
                                </div>
                                {data.projects.projects.length > 0 ? (
                                    <Badge className="bg-primary text-primary-foreground border-primary">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {data.projects.projects.length} Projects
                                    </Badge>
                                ) : (
                                    <Badge className="bg-muted text-foreground border">
                                        Optional
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Projects</span>
                                <span className="text-sm font-semibold text-foreground">{data.projects.projects.length} added</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Images</span>
                                <span className="text-sm font-semibold text-foreground">
                                    {data.projects.projects.reduce((acc, p) => acc + p.images.length, 0)} images
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step 5: Notepad */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Notepad</h3>
                                        <p className="text-xs text-muted-foreground">Step 5 - Optional</p>
                                    </div>
                                </div>
                                {data.notepad.defaultNotes.length > 0 ? (
                                    <Badge className="bg-primary text-primary-foreground border-primary">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {data.notepad.defaultNotes.length} Notes
                                    </Badge>
                                ) : (
                                    <Badge className="bg-muted text-foreground border">
                                        Optional
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Notes</span>
                                <span className="text-sm font-semibold text-foreground">{data.notepad.defaultNotes.length} notes</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Pinned</span>
                                <span className="text-sm font-semibold text-foreground">
                                    {data.notepad.defaultNotes.filter(n => n.isPinned).length} pinned
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step 6: Advanced */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Terminal className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Advanced Settings</h3>
                                        <p className="text-xs text-muted-foreground">Step 6 - Auto-Generated</p>
                                    </div>
                                </div>
                                <Badge className="bg-primary text-primary-foreground border-primary">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Auto-Generated
                                </Badge>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Terminal</span>
                                <Badge className="ml-auto bg-muted text-foreground">Ready</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <Database className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Database</span>
                                <Badge className="ml-auto bg-primary/10 text-primary border-primary">Ready</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <Settings className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Settings</span>
                                <Badge className="ml-auto bg-primary/10 text-primary border-primary">Ready</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                    {/* Download Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Download className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-foreground">Ready to Download</h4>
                                <p className="text-xs text-muted-foreground">Get your portfolio package</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Click the button below to generate and download your complete portfolio data package.
                        </p>

                        {/* Download Button */}
                        <Button
                            onClick={onDownload}
                            size="lg"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base py-6 mb-4 shadow-xl"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Download ZIP Package
                        </Button>

                        <div className="bg-muted rounded-xl p-4 border border">
                            <p className="text-xs text-muted-foreground mb-2">Package includes:</p>
                            <ul className="space-y-1 text-xs text-foreground">
                                <li>✓ All JSON data files</li>
                                <li>✓ Uploaded images</li>
                                <li>✓ Configuration files</li>
                                <li>✓ Ready to use</li>
                            </ul>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
                        <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-foreground">Summary</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary">
                                <span className="text-sm font-medium text-primary">Steps Complete</span>
                                <span className="text-lg font-bold text-primary">7/7</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary">
                                <span className="text-sm font-medium text-primary">Required Fields</span>
                                <span className="text-lg font-bold text-primary">
                                    {(data.about.personal.name && data.contact.email) ? "✓" : "✗"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted rounded-xl border border">
                                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                                <span className="text-lg font-bold text-foreground">{totalCompletion()}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border">
                        <h4 className="font-bold text-foreground mb-3">💡 Next Steps</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">1.</span>
                                <span>Review all sections above</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">2.</span>
                                <span>Go back to edit if needed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">3.</span>
                                <span>Click "Download ZIP" in header</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">4.</span>
                                <span>Extract and use in your portfolio</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}











