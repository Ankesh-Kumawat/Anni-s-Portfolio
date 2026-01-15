import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import type { EditorData } from "../../types";

interface DatabaseSettingsProps {
    data: EditorData;
}

export default function DatabaseSettings({ data }: DatabaseSettingsProps) {
    return (
        <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
            <div className="bg-primary/10 p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Database className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Database Settings</h3>
                        <p className="text-sm text-muted-foreground">User profile & projects data for Database app</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* User Table */}
                <div className="space-y-3">
                    <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        User Table
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="db-name" className="text-sm font-semibold text-foreground">
                                Name <span className="text-xs text-primary">(auto-filled)</span>
                            </Label>
                            <Input
                                id="db-name"
                                value={data.database.user.name}
                                disabled
                                className="bg-muted border h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="db-nickname" className="text-sm font-semibold text-foreground">
                                Nickname <span className="text-xs text-primary">(auto-generated)</span>
                            </Label>
                            <Input
                                id="db-nickname"
                                value={data.database.user.nickname}
                                disabled
                                className="bg-muted border h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="db-email" className="text-sm font-semibold text-foreground">
                                Email <span className="text-xs text-primary">(auto-filled)</span>
                            </Label>
                            <Input
                                id="db-email"
                                value={data.database.user.email}
                                disabled
                                className="bg-muted border h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="db-role" className="text-sm font-semibold text-foreground">
                                Role <span className="text-xs text-primary">(auto-filled)</span>
                            </Label>
                            <Input
                                id="db-role"
                                value={data.database.user.role}
                                disabled
                                className="bg-muted border h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="db-status" className="text-sm font-semibold text-foreground">
                                Status <span className="text-xs text-primary">(auto-set)</span>
                            </Label>
                            <Input
                                id="db-status"
                                value={data.database.user.status}
                                disabled
                                className="bg-muted border h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="db-department" className="text-sm font-semibold text-foreground">
                                Department <span className="text-xs text-primary">(auto-set)</span>
                            </Label>
                            <Input
                                id="db-department"
                                value={data.database.user.department}
                                disabled
                                className="bg-muted border h-11"
                            />
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                <div className="space-y-3 pt-4 border-t-2 border">
                    <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Projects Table
                        </h4>
                        <Badge variant="secondary">
                            {data.database.projects.length} {data.database.projects.length === 1 ? 'Project' : 'Projects'}
                        </Badge>
                    </div>

                    {data.database.projects.length > 0 ? (
                        <div className="bg-card rounded-xl border-2 border overflow-hidden">
                            <div className="overflow-x-auto max-h-[400px] scrollbar-hide">
                                <table className="w-full text-sm">
                                    <thead className="bg-primary text-primary-foreground sticky top-0">
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
                                            <tr key={project.project_id} className={index % 2 === 0 ? "bg-card" : "bg-primary/10/50"}>
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{project.project_id}</td>
                                                <td className="px-4 py-3 font-semibold text-foreground">{project.name}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={
                                                        project.status === "Completed" ? "bg-primary/10 text-primary border-primary" :
                                                            project.status === "In Progress" ? "bg-primary/10 text-primary border-primary" :
                                                                "bg-muted text-foreground border"
                                                    }>
                                                        {project.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-foreground">{project.platform}</td>
                                                <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate" title={project.tech_stack}>
                                                    {project.tech_stack}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-muted rounded-xl border-2 border-dashed border p-8 text-center">
                            <Database className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground font-medium">No projects added yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Add projects in Step 4 to see them here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
