import { DatabaseSchema, Table, Relationship }from '@/model/database-schema'

function parseTableToErDiagramMermaid(table: Table): string {
    let result = `${table.name} {\n`;
    const columns = table.columns;

    columns.forEach(col => {
        result += `${col.type.trim()} ${col.name.trim()} `;
        if (col.primary_key) {
            result += 'PK';
        } else if (col.foreign_key) {
            result += 'FK';
        }
        result += '\n';
    });
    result += '}\n';

    return result;
}

function parseRelationshipToErDiagramMermaid(relationship: Relationship): string {
    let result = `${relationship.from_table}`;
    
    switch (relationship.relationship_type) {
        case 'one-to-one':
            result += ' ||--|| ';
            break;
        case 'one-to-many':
            result += ' ||--o{ ';
            break;
        case 'many-to-one':
            result += ' }o--|| ';
            break;
        case 'many-to-many':
            result += ' }o--o{ ';
            break;
    }

    result += `${relationship.to_table} : ${relationship.on_column}\n`;

    return result;
}

export function parseDatabaseToErDiagramMermaid(database: DatabaseSchema): string {
    let mermaidFormat = 'erDiagram\n';

    database.tables.forEach(table => {
        mermaidFormat += parseTableToErDiagramMermaid(table);
    });

    database.relationships.forEach(relationship => {
        mermaidFormat += parseRelationshipToErDiagramMermaid(relationship);
    });

    return mermaidFormat;
}
