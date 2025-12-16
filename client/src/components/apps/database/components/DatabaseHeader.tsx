import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export function DatabaseHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Database Manager</h2>
                <p className="text-muted-foreground">Manage your tables and schemas.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Table
                </Button>
            </div>
        </div>
    );
}
