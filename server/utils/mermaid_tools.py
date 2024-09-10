"""
This module provides utility functions for working with Mermaid.js.
"""

from utils import logger


def parse_table_to_erdiagram_mermaid(table: dict):
    """
    Parses a single table definition into Mermaid.js ER diagram format.

    :param table: A dictionary representing a table with its name and columns.
    :return: A string in Mermaid.js ER diagram format for the given table.
    :raises KeyError: If the column type is not recognized.
    :raises TypeError: If the input is not a dictionary.
    """
    result = f"{table['name']} {{\n"
    columns = table["columns"]
    for col in columns:
        result += f"{col['type'].strip()}" + " "
        result += f"{col['name'].strip()}" + " "
        if col["primary_key"]:
            result += "PK"
        elif col["foreign_key"]:
            result += "FK"
        result += "\n"
    result += "}\n"

    return result


def parse_relationship_to_erdiagram_mermaid(relationship: dict):
    """
    Parses a single relationship definition into Mermaid.js ER diagram format.

    :param relationship: A dictionary representing a relationship between two tables.
    :return: A string in Mermaid.js ER diagram format for the given relationship.
    :raises ValueError: If the relationship type is not recognized.
    :raises KeyError: If the relationship type is not recognized.
    """
    result = f"{relationship['from_table']}"
    if relationship["relationship_type"] == "one-to-one":
        result += " ||--|| "
    elif relationship["relationship_type"] == "one-to-many":
        result += " ||--o{ "
    elif relationship["relationship_type"] == "many-to-many":
        result += " }o--o{ "
    else:
        raise ValueError("Invalid relationship type")

    result += f"{relationship['to_table']} : {relationship['on_column']}\n"

    return result


def parse_database_to_erdiagram_mermaid(database: dict):
    """
    Parses the entire database schema (tables and relationships) into Mermaid.js ER diagram format.

    :param database: A dictionary containing the database schema, including tables and relationships.
    :return: A string in Mermaid.js ER diagram format representing the entire database schema.
    :raises ValueError: If the column type is not recognized or the relationship type is not recognized.
    :raises TypeError: If the input is not a dictionary
    """
    mermaid_format = "erDiagram\n"
    for table in database["tables"]:
        mermaid_format += parse_table_to_erdiagram_mermaid(table)

    for relationship in database["relationships"]:
        mermaid_format += parse_relationship_to_erdiagram_mermaid(relationship)

    return mermaid_format


def create_er_diagram_mermaid(database: dict):
    """
    Creates an ER diagram in Mermaid.js format for the given database schema. If an error occurs, it logs the error
    and returns None.

    :param database: A dictionary containing the database schema, including tables and relationships.
    :return: A string in Mermaid.js ER diagram format if successful, otherwise None.
    """
    try:
        return parse_database_to_erdiagram_mermaid(database)
    except Exception as e:
        logger.exception(f"{e}")
        return None
