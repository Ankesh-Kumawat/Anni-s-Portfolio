import { DatabaseTable } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Info, List, Lightbulb } from "lucide-react";

interface TableDetailViewProps {
    table: DatabaseTable;
    onBack: () => void;
}

export function TableDetailView({ table, onBack }: TableDetailViewProps) {
    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="border-b bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-bold font-mono">{table.name}</h2>
                        <Badge variant={
                            table.status === 'Active' ? 'default' :
                                table.status === 'Live' ? 'default' :
                                    table.status === 'Maintenance' ? 'destructive' : 'secondary'
                        }>
                            {table.status}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground ml-12">
                    <span>{table.rows.toLocaleString()} rows</span>
                    <span>•</span>
                    <span>{table.size}</span>
                    <span>•</span>
                    <span>Updated {table.updated}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Description */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Info className="w-4 h-4 text-blue-500" />
                        Description
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-6">
                        {table.description}
                    </p>
                </div>

                {/* Common Fields */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <List className="w-4 h-4 text-green-500" />
                        Common Fields
                    </div>
                    <div className="pl-6 space-y-2">
                        {table.fields.map((field, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg border"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-sm font-semibold text-foreground">
                                            {field.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                                            {field.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {field.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Usage */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Database className="w-4 h-4 text-purple-500" />
                        Usage
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-6">
                        {table.usage}
                    </p>
                </div>

                {/* What This Represents */}
                <div className="space-y-2 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                        <Lightbulb className="w-4 h-4" />
                        What This Represents
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                        {table.represents}
                    </p>
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
