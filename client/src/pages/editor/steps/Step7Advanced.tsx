import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { StepProps } from "../types";

export default function Step7Advanced({ data, setData }: StepProps) {
    return (
        <div className="space-y-6 sm:space-y-8">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Advanced Settings</h2>
                <p className="text-sm sm:text-base text-gray-600">Terminal, Database & Settings configuration</p>
            </div>

            {/* Auto-fill Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-green-900">
                    ✅ These settings are automatically generated from your personal info. You can review and edit if needed.
                </p>
            </div>

            {/* Terminal Settings */}
            <div className="space-y-4 border rounded-lg p-4 sm:p-6 bg-gray-50">
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Terminal Settings</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Configuration for Terminal app</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="terminal-username">
                            Username <span className="text-xs text-green-600">(auto-generated)</span>
                        </Label>
                        <Input
                            id="terminal-username"
                            value={data.terminal.username}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    terminal: { ...prev.terminal, username: e.target.value },
                                }))
                            }
                            placeholder="username"
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="terminal-role">
                            User Role <span className="text-xs text-green-600">(auto-filled)</span>
                        </Label>
                        <Input
                            id="terminal-role"
                            value={data.terminal.userRole}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    terminal: { ...prev.terminal, userRole: e.target.value },
                                }))
                            }
                            placeholder="Developer"
                            disabled
                            className="bg-gray-100"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Technical Skills <span className="text-xs text-green-600">({data.terminal.skills.technical.length} from Step 1)</span></Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg border min-h-[60px]">
                        {data.terminal.skills.technical.length > 0 ? (
                            data.terminal.skills.technical.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No skills added yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Database Settings */}
            <div className="space-y-4 border rounded-lg p-4 sm:p-6 bg-gray-50">
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Database Settings</h3>
                    <p className="text-xs sm:text-sm text-gray-600">User profile data for Database app</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="db-name">
                            Name <span className="text-xs text-green-600">(auto-filled)</span>
                        </Label>
                        <Input
                            id="db-name"
                            value={data.database.user.name}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="db-nickname">
                            Nickname <span className="text-xs text-green-600">(auto-generated)</span>
                        </Label>
                        <Input
                            id="db-nickname"
                            value={data.database.user.nickname}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="db-email">
                            Email <span className="text-xs text-green-600">(auto-filled)</span>
                        </Label>
                        <Input
                            id="db-email"
                            value={data.database.user.email}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="db-role">
                            Role <span className="text-xs text-green-600">(auto-filled)</span>
                        </Label>
                        <Input
                            id="db-role"
                            value={data.database.user.role}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="db-status">Status</Label>
                        <Input
                            id="db-status"
                            value={data.database.user.status}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="db-department">Department</Label>
                        <Input
                            id="db-department"
                            value={data.database.user.department}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    database: {
                                        user: { ...prev.database.user, department: e.target.value },
                                    },
                                }))
                            }
                            placeholder="Engineering"
                        />
                    </div>
                </div>
            </div>

            {/* Settings App */}
            <div className="space-y-4 border rounded-lg p-4 sm:p-6 bg-gray-50">
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Settings App</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Account settings configuration</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="settings-name">
                            Account Name <span className="text-xs text-green-600">(auto-filled)</span>
                        </Label>
                        <Input
                            id="settings-name"
                            value={data.settings.account.name}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="settings-role">
                            Account Role <span className="text-xs text-green-600">(auto-filled)</span>
                        </Label>
                        <Input
                            id="settings-role"
                            value={data.settings.account.role}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>
                </div>

                {data.settings.account.avatar && (
                    <div className="space-y-2">
                        <Label>Avatar Preview</Label>
                        <img
                            src={data.settings.account.avatar}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
