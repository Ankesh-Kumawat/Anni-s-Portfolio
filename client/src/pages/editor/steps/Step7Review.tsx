import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Link2, FolderKanban, FileText, Terminal, Database, Settings, CheckCircle2, AlertCircle, Sparkles, Cloud } from "lucide-react";
import type { StepProps } from "../types";
import {
  calculateStep1Completion,
  calculateStep2Completion,
  calculateStep3Completion,
  calculateStep4Completion,
  calculateStep5Completion,
  calculateStep6Completion,
  calculateOverallCompletion
} from "../lib/completionCalculator";

export default function Step7Review({ data }: StepProps) {
    const isComplete = calculateStep1Completion(data) === 100 && calculateStep2Completion(data) === 100;

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Review & Summary</h2>
                        <p className="text-muted-foreground text-lg">Review your portfolio data - All changes are automatically saved to Firebase</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2 border">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Overall</div>
                            <div className="text-2xl font-bold text-primary">
                                {calculateOverallCompletion(data)}%
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
                            All required sections are filled and automatically saved to Firebase. Your portfolio is ready!
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
                            Some optional sections are incomplete. All changes are automatically saved to Firebase.
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
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Personal Info</h3>
                                        <p className="text-xs text-muted-foreground">Step 1</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-primary">{calculateStep1Completion(data)}%</span>
                                    {calculateStep1Completion(data) === 100 ? (
                                        <Badge className="bg-primary text-primary-foreground border-primary">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Complete
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-muted text-foreground border">
                                            In Progress
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Progress value={calculateStep1Completion(data)} className="h-2" />
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Name</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.about.personal.name || "Not set"}</span>
                                    {data.about.personal.name && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Title</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.about.personal.title || "Not set"}</span>
                                    {data.about.personal.title && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Location</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.about.personal.location || "Not set"}</span>
                                    {data.about.personal.location && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Bio</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.about.personal.bio ? `${data.about.personal.bio.length} chars` : "Not set"}</span>
                                    {data.about.personal.bio && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Avatar</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.about.personal.avatar ? "✓ Uploaded" : "Not set"}</span>
                                    {data.about.personal.avatar && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Skills</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.about.skills.length} added</span>
                                    {data.about.skills.length > 0 && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Contact */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Contact</h3>
                                        <p className="text-xs text-muted-foreground">Step 2</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-primary">{calculateStep2Completion(data)}%</span>
                                    {calculateStep2Completion(data) === 100 ? (
                                        <Badge className="bg-primary text-primary-foreground border-primary">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Complete
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-muted text-foreground border">
                                            In Progress
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Progress value={calculateStep2Completion(data)} className="h-2" />
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.contact.email || "Not set"}</span>
                                    {data.contact.email && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Location</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.contact.location || "Not set"}</span>
                                    {data.contact.location && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Message</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.contact.message ? "✓ Added" : "Not set"}</span>
                                    {data.contact.message && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Copyright</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">{data.contact.copyright ? "✓ Added" : "Not set"}</span>
                                    {data.contact.copyright && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Social Links */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Link2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Social Links</h3>
                                        <p className="text-xs text-muted-foreground">Step 3 - Optional</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-primary">{calculateStep3Completion(data)}%</span>
                                    <Badge className={data.social.links.length > 0 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border"}>
                                        {data.social.links.length > 0 ? `${data.social.links.length} Added` : 'Optional'}
                                    </Badge>
                                </div>
                            </div>
                            <Progress value={calculateStep3Completion(data)} className="h-2" />
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Links</span>
                                <span className="text-sm font-semibold text-foreground">{data.social.links.length} platforms</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-muted-foreground">With URLs</span>
                                <span className="text-sm font-semibold text-foreground">{data.social.links.filter(l => l.url).length} completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Projects & Gallery */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FolderKanban className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Projects & Gallery</h3>
                                        <p className="text-xs text-muted-foreground">Step 4 - Optional</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-primary">{calculateStep4Completion(data)}%</span>
                                    <Badge className={data.projects.projects.length > 0 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border"}>
                                        {data.projects.projects.length > 0 ? `${data.projects.projects.length} Projects` : 'Optional'}
                                    </Badge>
                                </div>
                            </div>
                            <Progress value={calculateStep4Completion(data)} className="h-2" />
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
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Notepad</h3>
                                        <p className="text-xs text-muted-foreground">Step 5 - Optional</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-primary">{calculateStep5Completion(data)}%</span>
                                    <Badge className={data.notepad.defaultNotes.length > 0 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border"}>
                                        {data.notepad.defaultNotes.length > 0 ? `${data.notepad.defaultNotes.length} Notes` : 'Optional'}
                                    </Badge>
                                </div>
                            </div>
                            <Progress value={calculateStep5Completion(data)} className="h-2" />
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Notes</span>
                                <span className="text-sm font-semibold text-foreground">{data.notepad.defaultNotes.length} notes</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Complete</span>
                                <span className="text-sm font-semibold text-foreground">
                                    {data.notepad.defaultNotes.filter(n => n.title && n.content).length} filled
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step 6: Advanced */}
                    <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
                        <div className="bg-muted p-5 border-b">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Terminal className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Advanced Settings</h3>
                                        <p className="text-xs text-muted-foreground">Step 6 - Auto-Generated</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-primary">{calculateStep6Completion(data)}%</span>
                                    <Badge className="bg-primary text-primary-foreground border-primary">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Auto-Generated
                                    </Badge>
                                </div>
                            </div>
                            <Progress value={calculateStep6Completion(data)} className="h-2" />
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Terminal</span>
                                <Badge className="ml-auto bg-muted text-foreground">
                                    {data.terminal.username ? 'Ready' : 'Waiting'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <Database className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Database</span>
                                <Badge className="ml-auto bg-primary/10 text-primary border-primary">
                                    {data.database.user.name ? 'Ready' : 'Waiting'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <Settings className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Settings</span>
                                <Badge className="ml-auto bg-primary/10 text-primary border-primary">
                                    {data.settings.account.name ? 'Ready' : 'Waiting'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                    {/* Firebase Status Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Cloud className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-foreground">Cloud Sync Active</h4>
                                <p className="text-xs text-muted-foreground">Auto-saved to Firebase</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            All your portfolio data is automatically saved to Firebase. You can access and edit it anytime from the editor.
                        </p>

                        <div className="bg-primary/10 rounded-xl p-4 border-2 border-primary">
                            <p className="text-xs font-semibold text-primary mb-2">✓ Saved to Cloud:</p>
                            <ul className="space-y-1 text-xs text-foreground">
                                <li>✓ Personal information</li>
                                <li>✓ Contact details</li>
                                <li>✓ Social links</li>
                                <li>✓ Projects & images</li>
                                <li>✓ All configurations</li>
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
                                <span className="text-lg font-bold text-foreground">{calculateOverallCompletion(data)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border">
                        <h4 className="font-bold text-foreground mb-3">💡 What's Next?</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>All data is saved to Firebase</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Images uploaded to Cloudinary</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Edit anytime from this editor</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Your portfolio is live and ready!</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}











