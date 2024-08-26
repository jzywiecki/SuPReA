def parse_table_to_erdiagram_mermaid(table):
    result = f"{table['name']} {{\n"
    columns = table['columns']
    for col in columns:
        result += f"{col['type'].strip()}" + " "
        result += f"{col['name'].strip()}" + " "
        if col['primary_key']:
            result += "PK"
        elif col['foreign_key']:
            result += "FK"
        result += "\n"
    result += "}\n"

    return result


def parse_relationship_to_erdiagram_mermaid(relationship):
    result = f"{relationship['from_table']}"
    if relationship['relationship_type'] == "one-to-one":
        result += " ||--|| "
    elif relationship['relationship_type'] == "one-to-many":
        result += " ||--o{ "
    elif relationship['relationship_type'] == "many-to-many":
        result += " }o--o{ "
    else:
        raise ValueError("Invalid relationship type")

    result += f"{relationship['to_table']} : {relationship['on_column']}\n"

    return result


def parse_database_to_erdiagram_mermaid(database):
    mermaid_format = "erDiagram\n"
    for table in database['tables']:
        mermaid_format += parse_table_to_erdiagram_mermaid(table)

    for relationship in database['relationships']:
        mermaid_format += parse_relationship_to_erdiagram_mermaid(relationship)

    return mermaid_format

