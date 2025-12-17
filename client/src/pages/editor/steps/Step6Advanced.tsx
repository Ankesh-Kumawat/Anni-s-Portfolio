import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Terminal, Database, Settings, Sparkles, Check, Info } from "lucide-react";
import type { StepProps } from "../types";

export default function Step6Advanced({ data }: StepProps) {
    const completionPercentage = () => {
        let filled = 0;
        let total = 8;

        if (data.terminal.username) filled++;
        if (data.terminal.userRole) filled++;
        if (data.database.user.name) filled++;
        if (data.database.user.email) filled++;
        if (data.database.user.role) filled++;
        if (data.database.user.department) filled++;
        if (data.settings.account.name) filled++;
        if (data.settings.account.role) filled++;

        return Math.round((filled / total) * 100);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Advanced Settings</h2>
                        <p className="text-gray-600 text-lg">Auto-generated configurations for Terminal, Database & Settings apps</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-2xl border border-blue-200">
                        <div className="text-right">
                            <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {completionPercentage()}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Auto-fill Notice */}
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-base font-bold text-green-900">All Settings Auto-Generated</p>
                    <p className="text-sm text-green-700 mt-1">
                        These configurations are automatically created from your personal info. No manual editing needed!
                    </p>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[1fr_380px] gap-8">
                {/* Left Column - Settings */}
                <div className="space-y-6">
                    {/* Terminal Settings */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <Terminal className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Terminal Settings</h3>
                                    <p className="text-sm text-gray-300">Configuration for Terminal app</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="terminal-username" className="text-sm font-semibold text-gray-700">
                                        Username <span className="text-xs text-green-600">(auto-generated)</span>
                                    </Label>
                                    <Input
                                        id="terminal-username"
                                        value={data.terminal.username}
                                        disabled
                                        className="bg-gray-50 border-gray-200 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="terminal-role" className="text-sm font-semibold text-gray-700">
                                        User Role <span className="text-xs text-green-600">(auto-filled)</span>
                                    </Label>
                                    <Input
                                        id="terminal-role"
                                        value={data.terminal.userRole}
                                        disabled
                                        className="bg-gray-50 border-gray-200 h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">
                                    Technical Skills <span className="text-xs text-green-600">({data.terminal.skills.technical.length} from Step 1)</span>
                                </Label>
                                <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200 min-h-[80px]">
                                    {data.terminal.skills.technical.length > 0 ? (
                                        data.terminal.skills.technical.map((skill, index) => (
                                            <Badge key={index} className="bg-slate-700 text-white border-slate-600 px-3 py-1">
                                                {skill}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No skills added yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Database Settings */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <Database className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Database Settings</h3>
                                    <p className="text-sm text-blue-100">User profile & projects data for Database app</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Table */}
                            <div className="space-y-3">
                                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    User Table
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="db-name" className="text-sm font-semibold text-gray-700">
                                            Name <span className="text-xs text-green-600">(auto-filled)</span>
                                        </Label>
                                        <Input
                                            id="db-name"
                                            value={data.database.user.name}
                                            disabled
                                            className="bg-gray-50 border-gray-200 h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="db-nickname" className="text-sm font-semibold text-gray-700">
                                            Nickname <span className="text-xs text-green-600">(auto-generated)</span>
                                        </Label>
                                        <Input
                                            id="db-nickname"
                                            value={data.database.user.nickname}
                                            disabled
                                            className="bg-gray-50 border-gray-200 h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="db-email" className="text-sm font-semibold text-gray-700">
                                            Email <span className="text-xs text-green-600">(auto-filled)</span>
                                        </Label>
                                        <Input
                                            id="db-email"
                                            value={data.database.user.email}
                                            disabled
                                            className="bg-gray-50 border-gray-200 h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="db-role" className="text-sm font-semibold text-gray-700">
                                            Role <span className="text-xs text-green-600">(auto-filled)</span>
                                        </Label>
                                        <Input
                                            id="db-role"
                                            value={data.database.user.role}
                                            disabled
                                            className="bg-gray-50 border-gray-200 h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="db-status" className="text-sm font-semibold text-gray-700">
                                            Status <span className="text-xs text-green-600">(auto-set)</span>
                                        </Label>
                                        <Input
                                            id="db-status"
                                            value={data.database.user.status}
                                            disabled
                                            className="bg-gray-50 border-gray-200 h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="db-department" className="text-sm font-semibold text-gray-700">
                                            Department <span className="text-xs text-green-600">(auto-set)</span>
                                        </Label>
                                        <Input
                                            id="db-department"
                                            value={data.database.user.department}
                                            disabled
                                            className="bg-gray-50 border-gray-200 h-11"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Projects Table */}
                            <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Projects Table
                                    </h4>
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                        {data.database.projects.length} {data.database.projects.length === 1 ? 'Project' : 'Projects'}
                                    </Badge>
                                </div>

                                {data.database.projects.length > 0 ? (
                                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border-2 border-blue-200 overflow-hidden">
                                        <div className="overflow-x-auto max-h-[400px] scrollbar-hide">
                                            <table className="w-full text-sm">
                                                <thead className="bg-blue-600 text-white sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold">ID</th>
                                                        <th className="px-4 py-3 text-left font-semibold">Name</th>
                                                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                                                        <th className="px-4 py-3 text-left font-semibold">Platform</th>
                                                        <th className="px-4 py-3 text-left font-semibold">Tech Stack</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.database.projects.map((project, index) => (
                                                        <tr key={project.project_id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50/50"}>
                                                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{project.project_id}</td>
                                                            <td className="px-4 py-3 font-semibold text-gray-900">{project.name}</td>
                                                            <td className="px-4 py-3">
                                                                <Badge className={
                                                                    project.status === "Completed" ? "bg-green-100 text-green-700 border-green-200" :
                                                                        project.status === "In Progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                                            "bg-gray-100 text-gray-700 border-gray-200"
                                                                }>
                                                                    {project.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-700">{project.platform}</td>
                                                            <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate" title={project.tech_stack}>
                                                                {project.tech_stack}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                                        <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-600 font-medium">No projects added yet</p>
                                        <p className="text-xs text-gray-500 mt-1">Add projects in Step 4 to see them here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings App */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Settings App</h3>
                                    <p className="text-sm text-purple-100">Account settings configuration</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="settings-name" className="text-sm font-semibold text-gray-700">
                                        Account Name <span className="text-xs text-green-600">(auto-filled)</span>
                                    </Label>
                                    <Input
                                        id="settings-name"
                                        value={data.settings.account.name}
                                        disabled
                                        className="bg-gray-50 border-gray-200 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="settings-role" className="text-sm font-semibold text-gray-700">
                                        Account Role <span className="text-xs text-green-600">(auto-filled)</span>
                                    </Label>
                                    <Input
                                        id="settings-role"
                                        value={data.settings.account.role}
                                        disabled
                                        className="bg-gray-50 border-gray-200 h-11"
                                    />
                                </div>
                            </div>

                            {data.settings.account.avatar && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">Avatar Preview</Label>
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                                        <img
                                            src={data.settings.account.avatar}
                                            alt="Avatar"
                                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{data.settings.account.name}</p>
                                            <p className="text-sm text-gray-600">{data.settings.account.role}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md">
                        <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-gray-900">Auto-Generated Data</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="text-sm font-medium text-slate-900">Terminal</span>
                                <Badge className="bg-slate-700 text-white">
                                    <Check className="w-3 h-3 mr-1" />
                                    Ready
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <span className="text-sm font-medium text-blue-900">Database</span>
                                <Badge className="bg-blue-600 text-white">
                                    <Check className="w-3 h-3 mr-1" />
                                    Ready
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <span className="text-sm font-medium text-purple-900">Settings</span>
                                <Badge className="bg-purple-600 text-white">
                                    <Check className="w-3 h-3 mr-1" />
                                    Ready
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-gray-900">About This Step</h4>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>All settings are automatically generated from your personal information</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Terminal uses your name and skills</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Database creates user profile & projects table</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Projects synced from Step 4</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Settings app uses your account info</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>No manual editing required!</span>
                            </li>
                        </ul>
                    </div>

                    {/* Help Card */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                        <h4 className="font-bold text-gray-900 mb-3">✨ Smart Features</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Username auto-generated from name</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Skills synced from Step 1</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Email synced from Step 2</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Projects synced from Step 4</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Avatar synced from Step 1</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
