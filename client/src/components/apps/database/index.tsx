import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { DatabaseHeader } from "./components/DatabaseHeader";
import { DatabaseTable } from "./components/DatabaseTable";

export default function Database() {
    return (
        <div className="flex flex-col h-full bg-background p-6 space-y-6">
            <DatabaseHeader />

            <div className="flex items-center gap-2">
                <Input placeholder="Filter tables..." className="max-w-xs" />
                <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                </Button>
            </div>

            <DatabaseTable />
        </div>
    );
}
