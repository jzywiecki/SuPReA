from utils.mermaid_tools import parse_table_to_erdiagram_mermaid
from utils.mermaid_tools import parse_relationship_to_erdiagram_mermaid
from utils.mermaid_tools import parse_database_to_erdiagram_mermaid

import unittest


class TestParseTableToErdiagramMermaid(unittest.TestCase):
    def test_parse_successfully(self):
        table = {
            "name": "users",
            "columns": [
                {"name": "id", "type": "int", "primary_key": True, "foreign_key": None},
                {"name": "username", "type": "string", "primary_key": False, "foreign_key": None},
                {"name": "email", "type": "string", "primary_key": False, "foreign_key": None},
                {"name": "account_id", "type": "int", "primary_key": False, "foreign_key": "Account(id)"}
            ]
        }

        expected_result = "users {\nint id PK\nstring username \nstring email \nint account_id FK\n}\n"
        self.assertEqual(parse_table_to_erdiagram_mermaid(table), expected_result)

    def test_invalid_input_table_schema_should_raise_key_error(self):
        table = {
            "name": "users",
            "columns": [
                {"name": "id", "type": "int", "primary_key invalid": True, "foreign_key": None},
            ]
        }

        with self.assertRaises(KeyError):
            parse_table_to_erdiagram_mermaid(table)

    def test_invalid_input_type_should_raise_type_error(self):
        table = []

        with self.assertRaises(TypeError):
            parse_table_to_erdiagram_mermaid(table)


class TestParseRelationshipToErdiagramMermaid(unittest.TestCase):
    relationship = {
        "from_table": "users",
        "to_table": "accounts",
        "on_column": "account_id"
    }

    def test_parse_one_to_one_successfully(self):
        self.relationship["relationship_type"] = "one-to-one"

        expected_result = "users ||--|| accounts : account_id\n"
        self.assertEqual(parse_relationship_to_erdiagram_mermaid(self.relationship), expected_result)

    def test_parse_one_to_many_successfully(self):
        self.relationship["relationship_type"] = "one-to-many"

        expected_result = "users ||--o{ accounts : account_id\n"
        self.assertEqual(parse_relationship_to_erdiagram_mermaid(self.relationship), expected_result)

    def test_parse_many_to_many_successfully(self):
        self.relationship["relationship_type"] = "many-to-many"

        expected_result = "users }o--o{ accounts : account_id\n"
        self.assertEqual(parse_relationship_to_erdiagram_mermaid(self.relationship), expected_result)

    def test_invalid_relationship_type_should_raise_value_error(self):
        self.relationship["relationship_type"] = "invalid"

        with self.assertRaises(ValueError):
            parse_relationship_to_erdiagram_mermaid(self.relationship)

    def test_invalid_input_relationship_schema_should_raise_key_error(self):
        invalid_relationship = {
            "from_table invalid": "users",
            "to_table": "accounts",
            "relationship_type": "one-to-one",
            "on_column": "account_id"
        }

        with self.assertRaises(KeyError):
            parse_relationship_to_erdiagram_mermaid(invalid_relationship)

    def test_invalid_input_type_should_raise_type_error(self):
        relationship = []

        with self.assertRaises(TypeError):
            parse_relationship_to_erdiagram_mermaid(relationship)


class TestParseDatabaseToErdiagramMermaid(unittest.TestCase):
    def test_parse_successfully(self):
        database = {
            "tables": [
                {
                    "name": "users",
                    "columns": [
                        {"name": "id", "type": "int", "primary_key": True, "foreign_key": None},
                        {"name": "username", "type": "string", "primary_key": False, "foreign_key": None},
                        {"name": "email", "type": "string", "primary_key": False, "foreign_key": None},
                        {"name": "account_id", "type": "int", "primary_key": False, "foreign_key": "Account(id)"}
                    ]
                },
                {
                    "name": "accounts",
                    "columns": [
                        {"name": "id", "type": "int", "primary_key": True, "foreign_key": None},
                        {"name": "name", "type": "string", "primary_key": False, "foreign_key": None},
                    ]
                }
            ],
            "relationships": [
                {
                    "from_table": "users",
                    "to_table": "accounts",
                    "relationship_type": "one-to-one",
                    "on_column": "account_id"
                }
            ]
        }

        expected_result = "erDiagram\nusers {\nint id PK\nstring username \nstring email \nint account_id FK\n}\naccounts {\nint id PK\nstring name \n}\nusers ||--|| accounts : account_id\n"
        self.assertEqual(parse_database_to_erdiagram_mermaid(database), expected_result)

    def test_invalid_input_database_schema_should_raise_key_error(self):
        database = {
            "tables invalid": [
                {
                    "name": "users",
                    "columns": [
                        {"name": "id", "type": "int", "primary_key": True, "foreign_key": None},
                    ]
                },
            ],
            "relationships": []
        }

        with self.assertRaises(KeyError):
            parse_database_to_erdiagram_mermaid(database)

    def test_invalid_input_type_should_raise_type_error(self):
        database = []

        with self.assertRaises(TypeError):
            parse_database_to_erdiagram_mermaid(database)


if __name__ == '__main__':
    unittest.main()
