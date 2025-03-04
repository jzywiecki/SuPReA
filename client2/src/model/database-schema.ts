export type Column = {
    name: string;
    type: string;
    primary_key?: boolean;
    foreign_key?: string;
};

export type Table = {
    name: string;
    columns: Column[];
};

export type Relationship = {
    from_table: string;
    to_table: string;
    relationship_type: string;
    on_column: string;
};

export type DatabaseSchema = {
    tables: Table[];
    relationships: Relationship[];
};
