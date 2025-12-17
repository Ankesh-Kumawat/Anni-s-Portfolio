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
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Review & Download</h2>
                        <p className="text-gray-600 text-lg">Review your portfolio data and download the complete package</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-2xl border border-blue-200">
                        <div className="text-right">
                            <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Overall</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {totalCompletion()}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Status Notice */}
            {isComplete ? (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-green-900">Portfolio Complete! 🎉</p>
                        <p className="text-sm text-green-700 mt-1">
                            All required sections are filled. Click "Download ZIP" in the header to get your portfolio data package.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-200 rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-amber-900">Almost There!</p>
                        <p className="text-sm text-amber-700 mt-1">
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
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Personal Info</h3>
                                        <p className="text-xs text-blue-100">Step 1</p>
                                    </div>
                                </div>
                                {data.about.personal.name && data.about.personal.avatar && data.about.personal.bio ? (
                                    <Badge className="bg-green-500 text-white border-green-400">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Complete
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-500 text-white border-amber-400">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Required
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Name</span>
                                <span className="text-sm font-semibold text-gray-900">{data.about.personal.name || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Title</span>
                                <span className="text-sm font-semibold text-gray-900">{data.about.personal.title || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Location</span>
                                <span className="text-sm font-semibold text-gray-900">{data.about.personal.location || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Skills</span>
                                <span className="text-sm font-semibold text-gray-900">{data.about.skills.length} added</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Experience</span>
                                <span className="text-sm font-semibold text-gray-900">{data.about.experience.length} entries</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Avatar</span>
                                <span className="text-sm font-semibold text-gray-900">{data.about.personal.avatar ? "✓ Uploaded" : "Not set"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Contact */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Contact</h3>
                                        <p className="text-xs text-purple-100">Step 2</p>
                                    </div>
                                </div>
                                {data.contact.email && data.contact.location ? (
                                    <Badge className="bg-green-500 text-white border-green-400">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Complete
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-500 text-white border-amber-400">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Required
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Email</span>
                                <span className="text-sm font-semibold text-gray-900">{data.contact.email || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Location</span>
                                <span className="text-sm font-semibold text-gray-900">{data.contact.location || "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Message</span>
                                <span className="text-sm font-semibold text-gray-900">{data.contact.message ? "✓ Added" : "Not set"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Copyright</span>
                                <span className="text-sm font-semibold text-gray-900">{data.contact.copyright ? "✓ Added" : "Not set"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Social Links */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-600 to-pink-500 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Link2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Social Links</h3>
                                        <p className="text-xs text-pink-100">Step 3 - Optional</p>
                                    </div>
                                </div>
                                {data.social.links.length > 0 ? (
                                    <Badge className="bg-green-500 text-white border-green-400">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {data.social.links.length} Added
                                    </Badge>
                                ) : (
                                    <Badge className="bg-gray-400 text-white">
                                        Optional
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Links</span>
                                <span className="text-sm font-semibold text-gray-900">{data.social.links.length} platforms</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Projects & Gallery */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <FolderKanban className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Projects & Gallery</h3>
                                        <p className="text-xs text-orange-100">Step 4 - Optional</p>
                                    </div>
                                </div>
                                {data.projects.projects.length > 0 ? (
                                    <Badge className="bg-green-500 text-white border-green-400">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {data.projects.projects.length} Projects
                                    </Badge>
                                ) : (
                                    <Badge className="bg-gray-400 text-white">
                                        Optional
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Projects</span>
                                <span className="text-sm font-semibold text-gray-900">{data.projects.projects.length} added</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Images</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {data.projects.projects.reduce((acc, p) => acc + p.images.length, 0)} images
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step 5: Notepad */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Notepad</h3>
                                        <p className="text-xs text-teal-100">Step 5 - Optional</p>
                                    </div>
                                </div>
                                {data.notepad.defaultNotes.length > 0 ? (
                                    <Badge className="bg-green-500 text-white border-green-400">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {data.notepad.defaultNotes.length} Notes
                                    </Badge>
                                ) : (
                                    <Badge className="bg-gray-400 text-white">
                                        Optional
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Notes</span>
                                <span className="text-sm font-semibold text-gray-900">{data.notepad.defaultNotes.length} notes</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pinned</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {data.notepad.defaultNotes.filter(n => n.isPinned).length} pinned
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step 6: Advanced */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Terminal className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Advanced Settings</h3>
                                        <p className="text-xs text-gray-300">Step 6 - Auto-Generated</p>
                                    </div>
                                </div>
                                <Badge className="bg-green-500 text-white border-green-400">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Auto-Generated
                                </Badge>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4 text-slate-600" />
                                <span className="text-sm text-gray-600">Terminal</span>
                                <Badge className="ml-auto bg-slate-100 text-slate-700">Ready</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <Database className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">Database</span>
                                <Badge className="ml-auto bg-blue-100 text-blue-700">Ready</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <Settings className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-600">Settings</span>
                                <Badge className="ml-auto bg-purple-100 text-purple-700">Ready</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                    {/* Download Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Download className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Ready to Download</h4>
                                <p className="text-xs text-blue-100">Get your portfolio package</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/90 mb-4">
                            Click the button below to generate and download your complete portfolio data package.
                        </p>

                        {/* Download Button */}
                        <Button
                            onClick={onDownload}
                            size="lg"
                            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-base py-6 mb-4 shadow-xl"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Download ZIP Package
                        </Button>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-xs text-white/80 mb-2">Package includes:</p>
                            <ul className="space-y-1 text-xs text-white">
                                <li>✓ All JSON data files</li>
                                <li>✓ Uploaded images</li>
                                <li>✓ Configuration files</li>
                                <li>✓ Ready to use</li>
                            </ul>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md">
                        <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-gray-900">Summary</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                                <span className="text-sm font-medium text-blue-900">Steps Complete</span>
                                <span className="text-lg font-bold text-blue-600">7/7</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                <span className="text-sm font-medium text-green-900">Required Fields</span>
                                <span className="text-lg font-bold text-green-600">
                                    {(data.about.personal.name && data.contact.email) ? "✓" : "✗"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                                <span className="text-sm font-medium text-purple-900">Overall Progress</span>
                                <span className="text-lg font-bold text-purple-600">{totalCompletion()}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                        <h4 className="font-bold text-gray-900 mb-3">💡 Next Steps</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">1.</span>
                                <span>Review all sections above</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">2.</span>
                                <span>Go back to edit if needed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">3.</span>
                                <span>Click "Download ZIP" in header</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">4.</span>
                                <span>Extract and use in your portfolio</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
