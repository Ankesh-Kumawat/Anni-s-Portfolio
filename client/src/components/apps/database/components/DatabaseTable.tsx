import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DATA } from "../constants";

export function DatabaseTable() {
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Table Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rows</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {DATA.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-medium font-mono text-blue-500">{row.name}</TableCell>
                            <TableCell>
                                <Badge variant={row.status === 'Active' ? 'default' : row.status === 'Maintenance' ? 'destructive' : 'secondary'}>
                                    {row.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{row.rows.toLocaleString()}</TableCell>
                            <TableCell>{row.size}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{row.updated}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
