import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Database as DatabaseIcon, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DATABASE_TABLES } from "./data";
import { DatabaseTable } from "./types";
import { TableDetailView } from "./components/TableDetailView";

export default function Database() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);

    const filteredTables = DATABASE_TABLES.filter(table =>
        table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedTable) {
        return (
            <TableDetailView
                table={selectedTable}
                onBack={() => setSelectedTable(null)}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="border-b bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-3 mb-2">
                    <DatabaseIcon className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Database Manager</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Conceptual representation of backend system design and data architecture
                </p>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tables..."
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table List */}
            <div className="flex-1 overflow-y-auto">
                {filteredTables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <DatabaseIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-semibold mb-2">No tables found</p>
                        <p className="text-sm">Try a different search term</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="border rounded-lg overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b text-xs font-semibold text-muted-foreground">
                                <div className="col-span-3">Table Name</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Rows</div>
                                <div className="col-span-2">Size</div>
                                <div className="col-span-3 text-right">Last Updated</div>
                            </div>

                            {/* Table Rows */}
                            {filteredTables.map((table) => (
                                <div
                                    key={table.id}
                                    onClick={() => setSelectedTable(table)}
                                    className="grid grid-cols-12 gap-4 px-4 py-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors group"
                                >
                                    <div className="col-span-3 font-mono text-sm font-semibold text-blue-500 group-hover:text-blue-600 flex items-center gap-2">
                                        <DatabaseIcon className="w-4 h-4" />
                                        {table.name}
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        <Badge
                                            variant={
                                                table.status === 'Active' ? 'default' :
                                                    table.status === 'Live' ? 'default' :
                                                        table.status === 'Maintenance' ? 'destructive' : 'secondary'
                                            }
                                        >
                                            {table.status}
                                        </Badge>
                                    </div>
                                    <div className="col-span-2 text-sm text-foreground flex items-center">
                                        {table.rows.toLocaleString()}
                                    </div>
                                    <div className="col-span-2 text-sm text-foreground flex items-center">
                                        {table.size}
                                    </div>
                                    <div className="col-span-3 text-sm text-muted-foreground text-right flex items-center justify-end">
                                        {table.updated}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Info Footer */}
                        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                                💡 <strong>Note:</strong> This is a conceptual database manager showcasing system design thinking.
                                Click any table to view its structure, purpose, and what it represents in real-world applications.
                                No actual data manipulation occurs.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
