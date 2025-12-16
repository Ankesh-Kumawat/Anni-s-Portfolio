export interface DatabaseTable {
    id: string;
    name: string;
    status: 'Active' | 'Archived' | 'Maintenance' | 'Live';
    rows: number;
    size: string;
    updated: string;
    description: string;
    fields: TableField[];
    usage: string;
    represents: string;
}

export interface TableField {
    name: string;
    type: string;
    description: string;
}
