import { DatabaseTable } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Table } from "lucide-react";
import { USER_DATA, PROJECTS_DATA } from "../data";

interface TableDetailViewProps {
    table: DatabaseTable;
    onBack: () => void;
}

export function TableDetailView({ table, onBack }: TableDetailViewProps) {
    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="border-b bg-muted/20 px-6 py-3">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold font-mono">{table.name}</h2>
                        <Badge variant={
                            table.status === 'Active' ? 'default' :
                                table.status === 'Live' ? 'default' :
                                    table.status === 'Maintenance' ? 'destructive' : 'secondary'
                        }>
                            {table.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
                        <span>{table.rows.toLocaleString()} rows</span>
                        <span>•</span>
                        <span>{table.size}</span>
                        <span>•</span>
                        <span>Updated {table.updated}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {/* Actual Data */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Table className="w-4 h-4 text-orange-500" />
                        Current Data ({table.rows} {table.rows === 1 ? 'row' : 'rows'})
                    </div>
                    <div className="pl-6 space-y-4">
                        {table.id === 'users' ? (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-2 gap-px bg-border">
                                    {USER_DATA.map((row, index) => (
                                        <div key={index} className="contents">
                                            <div className="bg-muted/50 px-4 py-3 font-mono text-sm font-semibold text-foreground">
                                                {row.field}
                                            </div>
                                            <div className="bg-background px-4 py-3 text-sm text-foreground">
                                                {row.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            Object.entries(PROJECTS_DATA).map(([id, data]) => (
                                <div key={id} className="border rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-2 gap-px bg-border">
                                        {data.map((row, index) => (
                                            <div key={index} className="contents">
                                                <div className="bg-muted/50 px-4 py-3 font-mono text-sm font-semibold text-foreground">
                                                    {row.field}
                                                </div>
                                                <div className="bg-background px-4 py-3 text-sm text-foreground">
                                                    {row.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>



                {/* Disclaimer */}
                <div className="text-xs text-muted-foreground border-t pt-4 mt-6">
                    <p>
                        💡 This is a conceptual representation of database design and system thinking.
                        No real data is stored or manipulated in this interface.
                    </p>
                </div>
            </div>
        </div>
    );
}
